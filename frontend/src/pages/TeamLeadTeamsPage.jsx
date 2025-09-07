import React, { useEffect } from 'react';
import { Card, Elevation, Button, Callout, Spinner } from '@blueprintjs/core';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardData } from '../dashboardSlice';

const TeamLeadTeamsPage = () => {
  const dispatch = useDispatch();
  const { teams, loading, error } = useSelector(state => state.dashboard);
  const token = useSelector((state) => state.user.access_token);
  useEffect(() => {

    if (token) {
      dispatch(fetchDashboardData(token));
    }
  }, [dispatch]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: '80vh', background: '#f5f8fa' }}>
      <Card elevation={Elevation.TWO} style={{ width: 500, marginTop: 40, padding: 32 }}>
        <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Manage Teams</h2>
        {error && <Callout intent="danger" style={{ marginBottom: 16 }}>{error}</Callout>}
        {loading ? <Spinner /> : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {teams.map(team => (
              <li key={team.id || team._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
                <span>{team.name}</span>
                <Button intent="text" />
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
};

export default TeamLeadTeamsPage;
