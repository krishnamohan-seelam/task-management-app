import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Teams from '../src/pages/Teams';
import * as api from '../src/api';

jest.mock('../src/api');

describe('Teams Page', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders teams', async () => {
        api.getTeamMembersPM.mockResolvedValueOnce({
            data: [
                { id: '1', name: 'Team A' },
                { id: '2', name: 'Team B' },
            ]
        });
        render(<Teams />);
        await waitFor(() => {
            expect(screen.getByText('Team A')).toBeInTheDocument();
            expect(screen.getByText('Team B')).toBeInTheDocument();
        });
    });

    it('shows error on API failure', async () => {
        api.getTeamMembersPM.mockRejectedValueOnce(new Error('API Error'));
        render(<Teams />);
        await waitFor(() => {
            expect(screen.getByText(/Failed to fetch teams/i)).toBeInTheDocument();
        });
    });
});
