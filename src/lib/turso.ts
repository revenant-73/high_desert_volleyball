import { createClient } from '@libsql/client';

const url = import.meta.env.TURSO_DATABASE_URL;
const authToken = import.meta.env.TURSO_AUTH_TOKEN;

// Only create the client if we have a URL, otherwise use a mock-like object
// to prevent initialization errors on the server if env vars are missing
export const turso = url 
  ? createClient({
      url: url,
      authToken: authToken || '',
    })
  : {
      execute: async () => ({ rows: [] }),
      batch: async () => [],
    } as any;
