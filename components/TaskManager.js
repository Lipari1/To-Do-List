'use client';

import { useState, useEffect } from 'react';
import TaskForm from './TaskForm';
import TaskList from './TaskList';

export default function TaskManager() {
  const [tasks, setTasks] = useState([]); // État pour stocker les tâches

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/tasks');
      if (!res.ok) {
        throw new Error('Failed to fetch tasks'); // Lance une erreur si la récupération échoue
      }
      const data = await res.json();
      // Filtrer les tâches pour exclure les tâches du jour
      const filteredTasks = data.filter(task => !task.isDailyTask);
      setTasks(filteredTasks); // Met à jour l'état avec les tâches filtrées
    } catch (error) {
      console.error('Error fetching tasks:', error); // Log de l'erreur en cas d'échec de la récupération
    }
  };

  useEffect(() => {
    fetchTasks(); // Récupère les tâches lors du montage du composant
  }, []);

  return (
    <div>
      <TaskForm onTaskAdded={fetchTasks} /> {/* Formulaire pour ajouter une nouvelle tâche */}
      <TaskList tasks={tasks} onTaskDeleted={fetchTasks} /> {/* Liste des tâches */}
    </div>
  );
}
