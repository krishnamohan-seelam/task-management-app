import React, { useEffect, useState } from 'react';
import { fetchTasks } from '../api';

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) return;
    fetchTasks(token)
      .then(data => setTasks(data.tasks || []))
      .catch(() => setError('Failed to fetch tasks'));
  }, []);

  return (
    <div>
      <h1>Tasks Page</h1>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <ul>
        {tasks.map(task => (
          <li key={task.id || task._id}>{task.title || task.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default Tasks;
