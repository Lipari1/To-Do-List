import { openDb } from '../../../../database/db.js';

export async function GET(request, { params }) {
  const db = openDb();
  const { id } = params;

  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);

  if (!task) {
    return new Response(JSON.stringify({ error: 'Task not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify(task), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function PUT(request, { params }) {
  const db = openDb();
  const { id } = params;
  const { content } = await request.json();

  const result = db.prepare('UPDATE tasks SET content = ? WHERE id = ?').run(content, id);

  if (result.changes === 0) {
    return new Response(JSON.stringify({ error: 'Task not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ message: 'Task updated' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function DELETE(request, { params }) {
  const db = openDb();
  const { id } = params;

  const result = db.prepare('DELETE FROM tasks WHERE id = ?').run(id);

  if (result.changes === 0) {
    return new Response(JSON.stringify({ error: 'Task not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ message: 'Task deleted' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}