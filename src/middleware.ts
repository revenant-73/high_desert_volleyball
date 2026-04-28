import { defineMiddleware } from 'astro:middleware';

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

    // Check for the session cookie
    const session = cookies.get('admin_session');

    if (!session || session.value !== 'true') {
      return redirect('/admin/login');
    }
  }

  return next();
});
