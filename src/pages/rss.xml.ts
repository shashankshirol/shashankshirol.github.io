import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPosts } from '../data/posts';
import { profile } from '../data/cv';

export async function GET(context: APIContext) {
  const posts = await getPosts();
  return rss({
    title: `${profile.name}: writing`,
    description: 'Notes and essays by Shashank Shirol.',
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: `/writing/${post.id}/`,
    })),
  });
}
