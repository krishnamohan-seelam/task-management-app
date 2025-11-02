import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DashboardPage from '../src/pages/DashboardPage';
import * as api from '../src/api';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

jest.mock('../src/api');

describe('DashboardPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const renderWithStore = (preloadedState) => {
        const testStore = configureStore({
            reducer: (state = preloadedState) => state
        });
        return render(<Provider store={testStore}><DashboardPage /></Provider>);
    };

    it('renders dashboard data', async () => {
        // Provide tasks in preloaded state so component renders without dispatching thunks
        const preloadedState = {
            user: { access_token: null, isAuthenticated: false },
            dashboard: { teams: [], tasks: [{ id: '1', title: 'Task X', status: 'pending' }], members: [], loading: false, error: '' }
        };
        renderWithStore(preloadedState);
        await waitFor(() => {
            expect(screen.getByText('Task X')).toBeInTheDocument();
        });
    });

    it('shows error on API failure', async () => {
        const preloadedState = {
            user: { access_token: null, isAuthenticated: false },
            dashboard: { teams: [], tasks: [], members: [], loading: false, error: 'Failed to fetch tasks' }
        };
        renderWithStore(preloadedState);
        await waitFor(() => {
            expect(screen.getByText(/Failed to fetch tasks/i)).toBeInTheDocument();
        });
    });
});
