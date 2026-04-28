import { createClient } from '@libsql/client';

const url = import.meta.env.TURSO_DATABASE_URL;
const authToken = import.meta.env.TURSO_AUTH_TOKEN;

export const turso = createClient({
  url: url || '',
  authToken: authToken || '',
});
