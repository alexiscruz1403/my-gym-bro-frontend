export type RuntimeConfig = {
  apiUrl: string;
  wsUrl: string;
  googleAuthUrl: string;
};

export const RUNTIME_CONFIG_ELEMENT_ID = '__APP_CONFIG__';

const EMPTY: RuntimeConfig = { apiUrl: '', wsUrl: '', googleAuthUrl: '' };

function readFromEnv(): RuntimeConfig {
  return {
    apiUrl: process.env.API_URL ?? '',
    wsUrl: process.env.WS_URL ?? '',
    googleAuthUrl: process.env.GOOGLE_AUTH_URL ?? '',
  };
}

let clientConfig: RuntimeConfig | null = null;

function readFromDocument(): RuntimeConfig {
  if (clientConfig) return clientConfig;

  const el = document.getElementById(RUNTIME_CONFIG_ELEMENT_ID);
  clientConfig = el?.textContent
    ? (JSON.parse(el.textContent) as RuntimeConfig)
    : EMPTY;

  return clientConfig;
}

export function getConfig(): RuntimeConfig {
  return typeof window === 'undefined' ? readFromEnv() : readFromDocument();
}

export function serializeConfig(): string {
  return JSON.stringify(readFromEnv()).replace(/</g, '\\u003c');
}
