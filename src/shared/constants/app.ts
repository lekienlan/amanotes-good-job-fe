export const APP_CONFIG = {
  APP_NAME: 'GOOD JOB',
  FEED_REFRESH_INTERVAL: 2000, // 2 seconds
  DEFAULT_GIVING_BUDGET: 200,
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000',
} as const;

export const EMOJI_REACTIONS = [
  '👍',
  '❤️',
  '🎉',
  '😍',
  '🔥',
  '💪',
  '🌟',
  '🚀'
] as const;
