import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DashboardPage from '../src/pages/DashboardPage';
import * as api from '../src/api';

jest.mock('../src/api');

describe('DashboardPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders dashboard data', async () => {
        api.getAllTasksPM.mockResolvedValueOnce({
            data: [
                { id: '1', title: 'Task X', status: 'pending' },
            ]
        });
        render(<DashboardPage />);
        await waitFor(() => {
            expect(screen.getByText('Task X')).toBeInTheDocument();
        });
    });

    it('shows error on API failure', async () => {
        api.getAllTasksPM.mockRejectedValueOnce(new Error('API Error'));
        render(<DashboardPage />);
        await waitFor(() => {
            expect(screen.getByText(/Failed to fetch tasks/i)).toBeInTheDocument();
        });
    });
});
