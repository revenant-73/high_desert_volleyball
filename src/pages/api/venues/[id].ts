import type { APIRoute } from 'astro';
import { updateVenue, deleteVenue } from '../../../lib/db';
import { requireAdmin } from '../../../lib/auth';

export const PUT: APIRoute = async ({ params, request, cookies }) => {
  if (!(await requireAdmin(cookies))) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const id = parseInt(params.id || '');
  if (isNaN(id)) {
    return new Response(JSON.stringify({ error: 'Invalid ID' }), { status: 400 });
  }

  try {
    const data = await request.json();
    const result = await updateVenue(id, data);
    
    if (result.success) {
      return new Response(JSON.stringify({ success: true, venue: result.venue }), { status: 200 });
    } else {
      return new Response(JSON.stringify({ error: 'Failed to update venue' }), { status: 500 });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Invalid request body' }), { status: 400 });
  }
};

export const DELETE: APIRoute = async ({ params, cookies }) => {
  if (!(await requireAdmin(cookies))) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const id = parseInt(params.id || '');
  if (isNaN(id)) {
    return new Response(JSON.stringify({ error: 'Invalid ID' }), { status: 400 });
  }

  const result = await deleteVenue(id);
  
  if (result.success) {
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } else {
    return new Response(JSON.stringify({ error: 'Failed to delete venue' }), { status: 500 });
  }
};
