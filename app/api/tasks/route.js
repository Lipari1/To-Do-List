import { openDb } from '../../../database/db.js';

export async function GET(request) {
  const db = openDb();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id'); // Récupérer l'ID de la tâche si fourni

  try {
    if (id) {
      // Récupérer une tâche spécifique par ID
      const task = db
        .prepare('SELECT id, name, content, date, isDailyTask FROM tasks WHERE id = ?')
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
    const tasks = db.prepare('SELECT id, name, content, date, isDailyTask FROM tasks').all();

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
    const { name, content, date, isDailyTask } = await request.json();

    if (!name || !date) {
      return new Response(
        JSON.stringify({ error: 'Name and date are required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Vérifier si une tâche avec le même nom existe déjà
    const existingTask = db.prepare('SELECT id FROM tasks WHERE name = ?').get(name);
    const existingDailyTask = db.prepare('SELECT id FROM daily_tasks WHERE content = ?').get(name);
    if (existingTask || existingDailyTask) {
      return new Response(
        JSON.stringify({ error: 'Task with the same name already exists' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const result = db
      .prepare('INSERT INTO tasks (name, content, date, isDailyTask) VALUES (?, ?, ?, ?)')
      .run(name, content, date, isDailyTask ? 1 : 0);

    return new Response(
      JSON.stringify({
        id: result.lastInsertRowid,
        name,
        content,
        date,
        isDailyTask: isDailyTask ? 1 : 0,
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

