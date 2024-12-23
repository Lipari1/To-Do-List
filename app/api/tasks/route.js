import { openDb } from '../../../database/db.js';

export async function GET(request) {
  const db = openDb();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id'); // Récupérer l'ID de la tâche si fourni

  try {
    if (id) {
      // Récupérer une tâche spécifique par ID
      const task = db
        .prepare('SELECT id, name, content FROM tasks WHERE id = ?')
        .get(id);

      if (!task) {
        return new Response(
          JSON.stringify({ error: 'Task not found' }),
          {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }

      return new Response(JSON.stringify(task), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Récupérer toutes les tâches (uniquement `id` et `name` pour la liste principale)
    const tasks = db.prepare('SELECT id, name FROM tasks').all();

    return new Response(JSON.stringify(tasks), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch tasks' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

export async function POST(request) {
  const db = openDb();

  try {
    const { name } = await request.json();

    if (!name) {
      return new Response(
        JSON.stringify({ error: 'Name is required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const result = db
      .prepare('INSERT INTO tasks (name, content) VALUES (?, ?)')
      .run(name, '');

    return new Response(
      JSON.stringify({
        id: result.lastInsertRowid,
        name,
        content: '',
      }),
      {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error inserting task:', error);
    return new Response(
      JSON.stringify({ error: 'Internal Server Error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

