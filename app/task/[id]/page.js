'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

export default function TaskDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [task, setTask] = useState(null);
  const [content, setContent] = useState('');
  const [date, setDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTaskContent, setSelectedTaskContent] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    if (id) {
      fetch(`/api/tasks?id=${id}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error('Failed to fetch task');
          }
          return res.json();
        })
        .then((data) => {
          setTask(data);
          setContent(data.content);
          setDate(new Date(data.date));
        })
        .catch((error) => console.error('Error fetching task:', error));
    }
  }, [id]);

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/tasks');
      if (!res.ok) {
        throw new Error('Failed to fetch tasks');
      }
      const data = await res.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content, date }),
      });
      if (!res.ok) {
        throw new Error('Failed to save task');
      }
      alert('Description mise à jour avec succès !');
      fetchTasks();
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    const taskForDate = tasks.find((task) => new Date(task.date).toDateString() === date.toDateString());
    setSelectedTaskContent(taskForDate ? taskForDate.content : '');
  };

  const handleSelectedTaskContentChange = (e) => {
    setSelectedTaskContent(e.target.value);
  };

  const handleSaveSelectedTask = async () => {
    try {
      console.log('Saving task for date:', selectedDate);
      console.log('Task content:', selectedTaskContent);
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: `Task for ${selectedDate.toDateString()}`, content: selectedTaskContent, date: selectedDate.toISOString() }),
      });
      console.log('Response status:', res.status);
      const text = await res.text();
      console.log('Response text:', text);
      if (!res.ok) {
        throw new Error('Failed to save task');
      }
      alert('Tâche enregistrée avec succès !');
      fetchTasks();
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        throw new Error('Failed to delete task');
      }
      alert('Tâche supprimée avec succès !');
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleToggleTask = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const taskDates = tasks.map((task) => new Date(task.date).toDateString());
      if (taskDates.includes(date.toDateString())) {
        return 'bg-green-500 text-white';
      }
    }
    return null;
  };

  if (!task) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-black flex">
      <div className="w-1/4 p-4 bg-gray-800 text-white overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Tâches pour {selectedDate ? selectedDate.toDateString() : '...'}</h2>
        <ul>
          {tasks
            .filter((task) => new Date(task.date).toDateString() === (selectedDate ? selectedDate.toDateString() : ''))
            .map((task) => (
              <li key={task.id} className="mb-2 flex items-center">
                <span className={`text-white ${task.completed ? 'line-through' : ''}`}>{task.content}</span>
                <button
                  onClick={() => handleToggleTask(task.id)}
                  className="ml-2 p-1 bg-gray-600 text-white rounded"
                >
                  &#x2713;
                </button>
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="ml-2 p-1 bg-red-600 text-white rounded"
                >
                  &#x2715;
                </button>
              </li>
            ))}
        </ul>
      </div>
      <div className="w-3/4 p-4 bg-white rounded shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-center text-black">{task.name}</h1>
        <textarea
          className="w-full p-2 border border-gray-300 rounded mb-2 text-black"
          value={content}
          onChange={handleContentChange}
          rows="10"
        />
        <button
          onClick={handleSave}
          className="w-full p-2 bg-blue-500 text-white rounded mb-2"
        >
          Enregistrer la tâche principale
        </button>
        <Calendar
          onChange={handleDateChange}
          value={selectedDate || date}
          className="mb-4"
          tileClassName={tileClassName}
        />
        {selectedDate && (
          <div className="mb-4">
            <h2 className="text-xl font-bold mb-2 text-black">Tâche pour {selectedDate.toDateString()}</h2>
            <textarea
              className="w-full p-2 border border-gray-300 rounded mb-2 text-black"
              value={selectedTaskContent}
              onChange={handleSelectedTaskContentChange}
              rows="5"
            />
            <button
              onClick={handleSaveSelectedTask}
              className="w-full p-2 bg-blue-500 text-white rounded mb-2"
            >
              Enregistrer la tâche du jour
            </button>
          </div>
        )}
        <button
          onClick={() => router.push('/')}
          className="w-full p-2 bg-gray-500 text-white rounded"
        >
          Retour
        </button>
      </div>
    </div>
  );
}