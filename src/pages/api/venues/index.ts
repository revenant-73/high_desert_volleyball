import type { APIRoute } from 'astro';
import { createVenue } from '../../../lib/db';
import { requireAdmin } from '../../../lib/auth';

export const POST: APIRoute = async ({ request, cookies }) => {
  if (!(await requireAdmin(cookies))) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    const data = await request.json();
    const result = await createVenue(data);
    
    if (result.success) {
      return new Response(JSON.stringify({ success: true, venue: result.venue }), { status: 201 });
    } else {
      return new Response(JSON.stringify({ error: 'Failed to create venue' }), { status: 500 });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Invalid request body' }), { status: 400 });
  }
};
