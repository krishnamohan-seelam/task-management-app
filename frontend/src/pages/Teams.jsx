import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardData } from '../dashboardSlice';

function Teams() {
  const dispatch = useDispatch();
  const { members, error } = useSelector(state => state.dashboard);
  const token = useSelector((state) => state.user.access_token);
  useEffect(() => {
    if (token) {
      dispatch(fetchDashboardData(token));
    }
  }, [dispatch]);

  return (
    <div>
      <h1>Teams Page</h1>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <ul>
        {members.map(member => (
          <li key={member.id || member._id}>{member.name || member.email}</li>
        ))}
      </ul>
    </div>
  );
}

export default Teams;
