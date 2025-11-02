import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProjectManagerTasksPage from '../src/pages/ProjectManagerTasksPage';
import * as api from '../src/api';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import userReducer from '../src//userSlice';

jest.mock('../src/api');
const createTestStore = (preloadedState = {}) => {
    return configureStore({
        reducer: {
            user: userReducer,
            // Add other reducers if needed
        },
        preloadedState,
    });
};

// Helper function to render with providers
const renderWithProviders = (component, { store = createTestStore(), ...renderOptions } = {}) => {
    return render(
        <Provider store={store}>
            <MemoryRouter future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true
            }}>
                {component}
            </MemoryRouter>
        </Provider>,
        renderOptions
    );
};
describe('ProjectManagerTasksPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders tasks list', async () => {
        api.getAllTasksPM.mockResolvedValueOnce({
            data: [
                { id: '1', title: 'Task 1', status: 'pending' },
                { id: '2', title: 'Task 2', status: 'completed' },
            ]
        });

        renderWithProviders(<ProjectManagerTasksPage />);
        await waitFor(() => {
            expect(screen.getByText('Task 1')).toBeInTheDocument();
            expect(screen.getByText('Task 2')).toBeInTheDocument();
        });
    });

    it('can create a task', async () => {
        api.createTask.mockResolvedValueOnce({});
        api.getAllTasksPM.mockResolvedValueOnce({
            data: [
                { id: '1', title: 'Task 1', status: 'pending' },
                { id: '2', title: 'Task 2', status: 'completed' },
                { id: '3', title: 'Task 3', status: 'pending' },
            ]
        });
        renderWithProviders(<ProjectManagerTasksPage />);
        fireEvent.change(screen.getByPlaceholderText(/Title/i), { target: { value: 'Task 3' } });
        fireEvent.click(screen.getByText(/Create Task/i));
        await waitFor(() => {
            expect(screen.getByText('Task 3')).toBeInTheDocument();
        });
    });

    it('shows error on API failure', async () => {
        api.getAllTasksPM.mockRejectedValueOnce(new Error('API Error'));
        renderWithProviders(<ProjectManagerTasksPage />);;
        await waitFor(() => {
            expect(screen.getByText(/Failed to fetch tasks/i)).toBeInTheDocument();
        });
    });
});
