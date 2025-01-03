'use client';

import TaskManager from '../components/TaskManager';

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="w-full max-w-md p-4 bg-white rounded shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-center text-black">To-Do List</h1>
        <TaskManager /> {/* Composant pour gérer les tâches */}
      </div>
    </div>
  );
  // Centre le contenu horizontalement et verticalement avec un fond noir
  // Conteneur blanc avec ombre pour afficher le titre et le gestionnaire de tâches
}


