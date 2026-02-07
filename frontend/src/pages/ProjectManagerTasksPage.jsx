import React, { useEffect, useState } from 'react';
import { Card, Elevation, Callout, Spinner } from '@blueprintjs/core';
import { getAllTasksPM } from '../api';

const ProjectManagerTasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAllTasksPM();
      // Ensure we access the correct data structure
      // api.js uses apiClient.get('/project-manager/tasks') which returns axios response object.
      // So res.data is expected.
      // Wait, api.js: export const getAllTasksPM = () => apiClient.get('/project-manager/tasks');
      // So res is the axios response. res.data contains { tasks: [...] } or checks backend.
      // Backend returns {"tasks": [...]}.
      // So res.data.tasks is correct.
      setTasks(Array.isArray(res.data.tasks) ? res.data.tasks : []);
    } catch (err) {
      setError('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: '80vh', background: '#f5f8fa' }}>
      <Card elevation={Elevation.TWO} style={{ width: 800, marginTop: 40, padding: 32 }}>
        <h2 style={{ textAlign: 'center', marginBottom: 24 }}>All Tasks</h2>
        {error && <Callout intent="danger" style={{ marginBottom: 16 }}>{error}</Callout>}

        {loading ? <Spinner /> : (
          <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
            {tasks.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#666' }}>No tasks found.</p>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {tasks.map(task => (
                  <li key={task.id || task.task_id} style={{ display: 'flex', flexDirection: 'column', padding: '16px', borderBottom: '1px solid #eee', marginBottom: '8px', background: '#fff', borderRadius: '4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong style={{ fontSize: '1.1em' }}>{task.title || task.name}</strong>
                      <span className={`bp5-tag ${task.status === 'completed' ? 'bp5-intent-success' : task.status === 'in_progress' ? 'bp5-intent-primary' : 'bp5-intent-warning'}`}>
                        {task.status ? task.status.replace('_', ' ') : 'Pending'}
                      </span>
                    </div>
                    {task.description && <p style={{ color: '#555', marginTop: '4px', marginBottom: '4px' }}>{task.description}</p>}
                    <div style={{ fontSize: '0.9em', color: '#888', marginTop: '4px' }}>
                      {task.team_name && <span style={{ marginRight: '16px' }}>Team: {task.team_name}</span>}
                      {task.team_member && <span>Assigned to: {task.team_member}</span>}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

export default ProjectManagerTasksPage;
