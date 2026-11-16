// The Projects section builds itself from your public GitHub repositories:
// the newest few, then the most-starred few. Forks are never shown.
// The Languages row under Skills comes from the same repositories.

export const githubUser = 'shashankshirol';

export const newestCount = 3;
export const mostStarredCount = 3;

// Repositories that should never appear, by name.
export const hiddenRepos = ['shashankshirol.github.io', 'Stuff-For-School'];

// By default a project shows its GitHub name and description. Add an entry
// here, keyed by repository name, to show something else.
export const overrides: Record<string, { name?: string; description?: string }> = {
  polyglass: {
    description: 'A translation engine that runs entirely on your own machine. Written in Rust.',
  },
  ClippySync: {
    description: 'Copy on Windows, paste on iPhone. Clipboard sync between trusted devices on the same network.',
  },
  Unshackled: {
    description:
      'Moves playlists and liked songs between Spotify and Apple Music, in either direction, without your data leaving the browser.',
  },
  LazyRemote: {
    description: 'Turns your phone into a remote for your PC’s media keys and mouse. Built for streaming without getting up.',
  },
  GeneratingNoisySpeechData: {
    name: 'Generating Noisy Speech',
    description: 'GANs that turn clean speech into noisy speech. The code behind my bachelor’s thesis.',
  },
  'Toonify-Cartoon-Effect': {
    name: 'Toonify',
    description: 'Turns photos into cartoons. A Python implementation of the Toonify paper.',
  },
};

// Things GitHub reports as languages that should not show up under Skills.
export const ignoredLanguages = ['Jupyter Notebook', 'Makefile', 'Dockerfile', 'Batchfile'];

// How many languages to show beside each project.
export const languagesPerProject = 3;
