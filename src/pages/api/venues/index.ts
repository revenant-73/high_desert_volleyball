import type { APIRoute } from 'astro';
import { createVenue } from '../../../lib/db';

export const POST: APIRoute = async ({ request, cookies }) => {
  const session = cookies.get('admin_session');
  if (!session || session.value !== 'true') {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    const data = await request.json();
    const result = await createVenue(data);
    
    if (result.success) {
      return new Response(JSON.stringify({ success: true }), { status: 201 });
    } else {
      return new Response(JSON.stringify({ error: 'Failed to create venue' }), { status: 500 });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Invalid request body' }), { status: 400 });
  }
};
