import React, { useEffect, useState } from 'react';
import { Card, Elevation, FormGroup, InputGroup, Button, Callout, Spinner } from '@blueprintjs/core';
import { getAllTasksPM, createTask, assignTaskPM } from '../api';
import { useDispatch, useSelector } from 'react-redux';
const ProjectManagerTasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const token = useSelector((state) => state.user.access_token);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [assignData, setAssignData] = useState({ taskId: '', userId: '' });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAllTasksPM(token);
      console.log(res.data.tasks);
      setTasks(Array.isArray(res.data.tasks) ? res.data.tasks : []);
    } catch (err) {
      setError('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await createTask(newTask);
      setNewTask({ title: '', description: '' });
      fetchTasks();
    } catch (err) {
      setError('Failed to create task');
    }
  };

  const handleAssignTask = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await assignTaskPM(assignData);
      setAssignData({ taskId: '', userId: '' });
    } catch (err) {
      setError('Failed to assign task');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: '80vh', background: '#f5f8fa' }}>
      <Card elevation={Elevation.TWO} style={{ width: 600, marginTop: 40, padding: 32 }}>
        <h2 style={{ textAlign: 'center', marginBottom: 24 }}>All Tasks</h2>
        {error && <Callout intent="danger" style={{ marginBottom: 16 }}>{error}</Callout>}
        <form onSubmit={handleCreateTask} style={{ marginBottom: 24 }}>
          <FormGroup label="Title" labelFor="task-title">
            <InputGroup id="task-title" value={newTask.title} onChange={e => setNewTask({ ...newTask, title: e.target.value })} placeholder="Task Title" required />
          </FormGroup>
          <FormGroup label="Description" labelFor="task-desc">
            <InputGroup id="task-desc" value={newTask.description} onChange={e => setNewTask({ ...newTask, description: e.target.value })} placeholder="Task Description" />
          </FormGroup>
          <Button type="submit" intent="primary">Create Task</Button>
        </form>
        <form onSubmit={handleAssignTask} style={{ marginBottom: 24 }}>
          <FormGroup label="Task ID" labelFor="assign-task-id">
            <InputGroup id="assign-task-id" value={assignData.taskId} onChange={e => setAssignData({ ...assignData, taskId: e.target.value })} placeholder="Task ID" required />
          </FormGroup>
          <FormGroup label="User ID" labelFor="assign-user-id">
            <InputGroup id="assign-user-id" value={assignData.userId} onChange={e => setAssignData({ ...assignData, userId: e.target.value })} placeholder="User ID" required />
          </FormGroup>
          <Button type="submit" intent="success">Assign Task</Button>
        </form>

        {
          loading ? <Spinner /> : (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {tasks.map(task => (
                <li key={task.id || task.task_id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
                  <span>
                    <strong>{task.title || task.name}</strong>
                    {task.description && <span style={{ color: '#888', fontSize: 14 }}> — {task.description}</span>}
                  </span>
                </li>
              ))}
            </ul>
          )}
      </Card>
    </div>
  );
};

export default ProjectManagerTasksPage;
