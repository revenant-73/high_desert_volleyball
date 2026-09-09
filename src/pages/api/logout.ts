import type { APIRoute } from 'astro';
import { deleteAdminSession } from '../../lib/auth';

export const POST: APIRoute = async ({ cookies, redirect }) => {
  await deleteAdminSession(cookies);
  return redirect('/admin/login');
};
