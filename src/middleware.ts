import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  const { url, request } = context;
  
  // Only protect the /keystatic route
  if (url.pathname.startsWith('/keystatic')) {
    const password = import.meta.env.KEYSTATIC_PASSWORD;
    
    // If no password is set in env, allow access (local dev)
    if (!password) {
      return next();
    }

    const authHeader = request.headers.get('Authorization');

    if (authHeader) {
      // Decode the Basic Auth header
      const base64 = authHeader.split(' ')[1];
      const decoded = atob(base64);
      const [user, pwd] = decoded.split(':');

      // Check if password matches (username can be anything)
      if (pwd === password) {
        return next();
      }
    }

    // If auth fails or is missing, return 401 with challenge
    return new Response('Authentication required', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="HDVL Admin"',
      },
    });
  }

  return next();
});
