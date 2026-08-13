import { db } from './db';

export const TEMP_ID_PREFIX = 'offline_';

export function isTempId(id: string): boolean {
  return id.startsWith(TEMP_ID_PREFIX);
}

export async function setMapping(tempId: string, realId: string): Promise<void> {
  await db.idMap.put({ tempId, realId });
}

export async function getRealId(tempId: string): Promise<string | null> {
  const mapping = await db.idMap.get(tempId);
  return mapping?.realId ?? null;
}

export async function resolveIds(input: string): Promise<string> {
  const matches = input.match(/offline_[a-zA-Z0-9_-]+/g);
  if (!matches) return input;

  let resolved = input;
  for (const tempId of [...new Set(matches)]) {
    const realId = await getRealId(tempId);
    if (realId) {
      resolved = resolved.replaceAll(tempId, realId);
    }
  }
  return resolved;
}

export async function resolvePayload(payload: unknown): Promise<unknown> {
  if (payload == null) return payload;
  const serialized = JSON.stringify(payload);
  const resolved = await resolveIds(serialized);
  return JSON.parse(resolved);
}
