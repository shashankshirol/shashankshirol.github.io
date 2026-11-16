// Visitors that identify themselves with one of these names are treated as AI
// agents and asked to pay for blog posts. Matching is case-insensitive and
// looks anywhere in the User-Agent header. Add or remove names freely.
//
// This only catches agents that are honest about who they are. One that
// pretends to be a normal browser reads for free.
export const aiAgents = [
  // OpenAI
  'GPTBot',
  'ChatGPT-User',
  'OAI-SearchBot',
  // Anthropic
  'ClaudeBot',
  'Claude-User',
  'Claude-SearchBot',
  'anthropic-ai',
  // Perplexity
  'PerplexityBot',
  'Perplexity-User',
  // Others
  'Amazonbot',
  'Bytespider',
  'CCBot',
  'cohere-ai',
  'Diffbot',
  'DuckAssistBot',
  'meta-externalagent',
  'Meta-ExternalFetcher',
  'MistralAI-User',
  'YouBot',
  'AI2Bot',
];

const pattern = new RegExp(aiAgents.map((name) => name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'), 'i');

export const isAiAgent = (userAgent: string | null | undefined) => !!userAgent && pattern.test(userAgent);
