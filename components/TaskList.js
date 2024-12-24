'use client';

import Link from 'next/link';

export default function TaskList({ tasks, onTaskDeleted }) {
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        throw new Error('Failed to delete task'); // Lance une erreur si la suppression échoue
      }
      if (onTaskDeleted) onTaskDeleted(); // Appelle la fonction de rappel si elle est définie
    } catch (error) {
      console.error('Error deleting task:', error); // Log de l'erreur en cas d'échec de la suppression
    }
  };

  return (
    <ul className="list-decimal pl-5">
      {tasks.map((task, index) => (
        <li key={task.id} className="flex justify-between items-center mb-2 text-black">
          <Link href={`/task/${task.id}`} className="text-blue-500 underline">
            {index + 1}. {task.name} {/* Lien vers les détails de la tâche */}
          </Link>
          <button
            onClick={() => handleDelete(task.id)} // Appelle la fonction de suppression lors du clic
            className="ml-2 p-1 bg-red-500 text-white rounded"
          >
            Supprimer
          </button>
        </li>
      ))}
    </ul>
  );
}
