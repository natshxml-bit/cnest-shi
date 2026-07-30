import { SHNGM_BASE_URL, SHNGM_ORIGIN } from './config';

const HEADERS: Record<string, string> = {
  Accept: 'application/json',
  'Accept-Language': 'en-US,en;q=0.9',
  'Content-Type': 'application/json',
  Origin: SHNGM_ORIGIN,
  Referer: `${SHNGM_ORIGIN}/`,
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
};

/**
 * Wrapper fetch ke api.shngm.io.
 * Dipakai bareng oleh home.service.ts & detail.service.ts biar header
 * (Origin/Referer/User-Agent) nggak perlu ditulis ulang di tiap module.
 */
export async function shngmFetch<T = any>(path: string): Promise<T> {
  const res = await fetch(`${SHNGM_BASE_URL}${path}`, { headers: HEADERS });
  if (!res.ok) {
    throw new Error(`GET ${path} -> HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}
