import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardData } from '../dashboardSlice';

function Tasks() {
  const dispatch = useDispatch();
  const { tasks, error } = useSelector(state => state.dashboard);
  const token = useSelector((state) => state.user.access_token);
  useEffect(() => {

    if (token) {
      dispatch(fetchDashboardData(token));
    }
  }, [dispatch]);

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
