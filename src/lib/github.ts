// Reads your public repositories from the GitHub API at build time and picks
// the projects to show, following the settings in src/data/projects.ts.
//
// Responses are cached in .astro/github-cache.json for a few hours so the dev server
// does not burn through GitHub's unauthenticated limit (60 requests an hour).
// Set GITHUB_TOKEN to raise that limit; the deploy workflow does.

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import {
  githubUser,
  newestCount,
  mostStarredCount,
  hiddenRepos,
  overrides,
  ignoredLanguages,
  languagesPerProject,
} from '../data/projects';

export interface Project {
  name: string;
  href: string;
  description: string;
  languages: string[];
  stars: number;
}

interface Repo {
  name: string;
  href: string;
  description: string | null;
  stars: number;
  language: string | null;
  createdAt: string;
  pushedAt: string;
}

interface Cache {
  fetchedAt: number;
  repos: Repo[];
  languages: Record<string, Record<string, number>>; // repo name -> language -> bytes
}

const CACHE_DIR = join(process.cwd(), '.astro');
const CACHE_FILE = join(CACHE_DIR, 'github-cache.json');
const CACHE_TTL = 6 * 60 * 60 * 1000;
const ignored = new Set(ignoredLanguages);

async function github(path: string) {
  const token = process.env.GITHUB_TOKEN;
  const res = await fetch(`https://api.github.com/${path}`, {
    headers: {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'astro-site-build',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) throw new Error(`GitHub answered ${res.status} for ${path}`);
  return res.json();
}

async function fetchAll(): Promise<Cache> {
  const raw: any[] = await github(`users/${githubUser}/repos?per_page=100&type=owner`);
  const repos: Repo[] = raw
    .filter((r) => !r.fork && !r.private && !hiddenRepos.includes(r.name))
    .map((r) => ({
      name: r.name,
      href: r.html_url,
      description: r.description,
      stars: r.stargazers_count,
      language: r.language,
      createdAt: r.created_at,
      pushedAt: r.pushed_at,
    }));

  const { newest, mostStarred } = pick(repos);
  const languages: Cache['languages'] = {};
  await Promise.all(
    [...newest, ...mostStarred].map(async (repo) => {
      languages[repo.name] = await github(`repos/${githubUser}/${repo.name}/languages`);
    }),
  );
  return { fetchedAt: Date.now(), repos, languages };
}

async function load(): Promise<Cache> {
  let cached: Cache | undefined;
  try {
    cached = JSON.parse(await readFile(CACHE_FILE, 'utf8'));
  } catch {}
  if (cached?.repos && Date.now() - cached.fetchedAt < CACHE_TTL) return cached;

  try {
    const fresh = await fetchAll();
    await mkdir(CACHE_DIR, { recursive: true });
    await writeFile(CACHE_FILE, JSON.stringify(fresh, null, 2));
    return fresh;
  } catch (error) {
    // Never publish an empty Projects section from CI.
    if (process.env.CI) throw error;
    failed = true;
    const fallback = cached?.repos ? 'Using older cached data' : 'Projects will be empty';
    console.warn(`[projects] ${(error as Error).message}. ${fallback}.`);
    return cached?.repos ? cached : { fetchedAt: 0, repos: [], languages: {} };
  }
}

function pick(repos: Repo[]) {
  const newest = [...repos]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, newestCount);
  const mostStarred = [...repos]
    .filter((r) => r.stars > 0 && !newest.includes(r))
    .sort((a, b) => b.stars - a.stars)
    .slice(0, mostStarredCount);
  return { newest, mostStarred };
}

async function resolve() {
  const { repos, languages } = await load();
  const { newest, mostStarred } = pick(repos);

  const toProject = (repo: Repo): Project => ({
    name: overrides[repo.name]?.name ?? repo.name.replace(/[-_]/g, ' '),
    href: repo.href,
    description: overrides[repo.name]?.description ?? repo.description ?? '',
    languages: Object.entries(languages[repo.name] ?? {})
      .filter(([name]) => !ignored.has(name))
      .sort((a, b) => b[1] - a[1])
      .slice(0, languagesPerProject)
      .map(([name]) => name),
    stars: repo.stars,
  });

  // Skills: the main language of every repository, most recently used first.
  const skillLanguages: string[] = [];
  for (const repo of [...repos].sort((a, b) => b.pushedAt.localeCompare(a.pushedAt))) {
    if (repo.language && !ignored.has(repo.language) && !skillLanguages.includes(repo.language)) {
      skillLanguages.push(repo.language);
    }
  }

  return {
    newest: newest.map(toProject),
    mostStarred: mostStarred.map(toProject),
    languages: skillLanguages,
  };
}

let pending: ReturnType<typeof resolve> | undefined;
let failed = false;

/** Projects for the home page, plus the languages used across all repositories. */
export const getProjects = () =>
  (pending ??= resolve().finally(() => {
    // After a failed fetch, try again on the next page load instead of keeping the empty result.
    if (failed) pending = undefined;
    failed = false;
  }));
