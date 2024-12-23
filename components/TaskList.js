// filepath: /home/lipari_m/Projet/to-do-list/components/TaskList.js
export default function TaskList({ tasks, onTaskDeleted }) {
  const handleDelete = async (id) => {
    await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
    onTaskDeleted();
  };

  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          {task.content}
          <button onClick={() => handleDelete(task.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}