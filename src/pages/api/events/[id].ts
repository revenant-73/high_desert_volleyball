import type { APIRoute } from 'astro';
import { updateEvent, deleteEvent } from '../../../lib/db';

export const PUT: APIRoute = async ({ params, request, cookies }) => {
  const session = cookies.get('admin_session');
  if (!session || session.value !== 'true') {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const id = parseInt(params.id || '');
  if (isNaN(id)) {
    return new Response(JSON.stringify({ error: 'Invalid ID' }), { status: 400 });
  }

  try {
    const data = await request.json();
    const result = await updateEvent(id, data);
    
    if (result.success) {
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    } else {
      return new Response(JSON.stringify({ error: 'Failed to update event' }), { status: 500 });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Invalid request body' }), { status: 400 });
  }
};

export const DELETE: APIRoute = async ({ params, cookies }) => {
  const session = cookies.get('admin_session');
  if (!session || session.value !== 'true') {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const id = parseInt(params.id || '');
  if (isNaN(id)) {
    return new Response(JSON.stringify({ error: 'Invalid ID' }), { status: 400 });
  }

  const result = await deleteEvent(id);
  
  if (result.success) {
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } else {
    return new Response(JSON.stringify({ error: 'Failed to delete event' }), { status: 500 });
  }
};
