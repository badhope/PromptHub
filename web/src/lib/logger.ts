const IS_DEV = process.env.NODE_ENV === 'development';

export const logger = {
  log: (...args: unknown[]) => {
    if (IS_DEV) {
      console.log(...args);
    }
  },

  warn: (...args: unknown[]) => {
    if (IS_DEV) {
      console.warn(...args);
    }
  },

  error: (...args: unknown[]) => {
    if (IS_DEV) {
      console.error(...args);
    }
  },

  debug: (...args: unknown[]) => {
    if (IS_DEV) {
      console.debug(...args);
    }
  },

  info: (...args: unknown[]) => {
    if (IS_DEV) {
      console.info(...args);
    }
  },
} as const;
