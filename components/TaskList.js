'use client';

import Link from 'next/link';

export default function TaskList({ tasks, onTaskDeleted }) {
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        throw new Error('Failed to delete task');
      }
      if (onTaskDeleted) onTaskDeleted();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <ul className="list-disc pl-5">
      {tasks.map((task) => (
        <li key={task.id} className="flex justify-between items-center mb-2 text-black">
          <Link href={`/task/${task.id}`} className="text-blue-500 underline">
            {task.name}
          </Link>
          <button
            onClick={() => handleDelete(task.id)}
            className="ml-2 p-1 bg-red-500 text-white rounded"
          >
            Supprimer
          </button>
        </li>
      ))}
    </ul>
  );
}
