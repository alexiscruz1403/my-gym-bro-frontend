/**
 * Runtime configuration.
 *
 * These values used to be NEXT_PUBLIC_* variables, which webpack replaces with
 * string literals at build time — that baked the environment into the image and
 * made it unusable anywhere other than where it was built.
 *
 * Now the server reads them from its own environment on every request and the
 * root layout embeds them into the HTML, so a single image works everywhere.
 */

export type RuntimeConfig = {
  /** API base URL as reached from the browser. */
  apiUrl: string;
  /** Socket.IO origin as reached from the browser (no REST prefix). */
  wsUrl: string;
  /** Entry point that redirects to the Google consent screen. */
  googleAuthUrl: string;
};

/** Id of the <script> tag the root layout writes the config into. */
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

/**
 * Reads the config from the environment on the server, and from the JSON the
 * server embedded in the document on the browser. The script tag lives in
 * <head>, so the value is already there before any bundle runs — no race.
 */
export function getConfig(): RuntimeConfig {
  return typeof window === 'undefined' ? readFromEnv() : readFromDocument();
}

/**
 * Serializes the config for the root layout. Escaping `<` prevents a value
 * containing `</script>` from closing the tag early.
 */
export function serializeConfig(): string {
  return JSON.stringify(readFromEnv()).replace(/</g, '\\u003c');
}
