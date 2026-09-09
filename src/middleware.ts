import { defineMiddleware } from 'astro:middleware';
import { getAdminFromCookies } from './lib/auth';

export const onRequest = defineMiddleware(async (context, next) => {
  const { url, cookies, redirect } = context;

  if (!url) {
    return next();
  }

  // Only protect routes starting with /admin
  if (url.pathname.startsWith('/admin')) {
    // Allow access to the login page
    if (url.pathname === '/admin/login') {
      return next();
    }

    const admin = await getAdminFromCookies(cookies);
    if (!admin) {
      return redirect('/admin/login');
    }
  }

  return next();
});
