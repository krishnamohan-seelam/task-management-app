import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Tasks from '../src/pages/Tasks';
import * as api from '../src/api';

jest.mock('../src/api');

describe('Tasks Page', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders tasks', async () => {
        api.getAllTasksPM.mockResolvedValueOnce({
            data: [
                { id: '1', title: 'Task A', status: 'pending' },
                { id: '2', title: 'Task B', status: 'completed' },
            ]
        });
        render(<Tasks />);
        await waitFor(() => {
            expect(screen.getByText('Task A')).toBeInTheDocument();
            expect(screen.getByText('Task B')).toBeInTheDocument();
        });
    });

    it('shows error on API failure', async () => {
        api.getAllTasksPM.mockRejectedValueOnce(new Error('API Error'));
        render(<Tasks />);
        await waitFor(() => {
            expect(screen.getByText(/Failed to fetch tasks/i)).toBeInTheDocument();
        });
    });
});
