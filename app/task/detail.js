import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function TaskDetail() {
  const router = useRouter();
  const { id } = router.query; // Récupérer l'ID de la tâche à partir des paramètres de la route
  const [task, setTask] = useState(null); // État pour stocker les détails de la tâche

  useEffect(() => {
    if (id) {
      fetch(`/api/tasks/${id}`)
        .then((res) => res.json())
        .then((data) => setTask(data)) // Mettre à jour l'état avec les détails de la tâche
        .catch((error) => console.error('Error fetching task:', error)); // Log de l'erreur en cas d'échec de la récupération
    }
  }, [id]); // Exécuter l'effet lorsque l'ID change

  if (!task) {
    return <div>Loading...</div>; // Affiche un message de chargement si la tâche n'est pas encore chargée
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-md p-4 bg-white rounded shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-center text-black">Task Detail</h1>
        <div className="text-black">
          <p>{task.content}</p> {/* Affiche le contenu de la tâche */}
        </div>
      </div>
    </div>
  );
}