import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProjectManagerTasksPage from '../src/pages/ProjectManagerTasksPage';
import * as api from '../src/api';

jest.mock('../src/api');

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
        render(<ProjectManagerTasksPage />);
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
        render(<ProjectManagerTasksPage />);
        fireEvent.change(screen.getByPlaceholderText(/Title/i), { target: { value: 'Task 3' } });
        fireEvent.click(screen.getByText(/Create Task/i));
        await waitFor(() => {
            expect(screen.getByText('Task 3')).toBeInTheDocument();
        });
    });

    it('shows error on API failure', async () => {
        api.getAllTasksPM.mockRejectedValueOnce(new Error('API Error'));
        render(<ProjectManagerTasksPage />);
        await waitFor(() => {
            expect(screen.getByText(/Failed to fetch tasks/i)).toBeInTheDocument();
        });
    });
});
