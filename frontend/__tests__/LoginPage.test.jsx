import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '../src/pages/LoginPage';
import * as api from '../src/api';

jest.mock('../src/api');

describe('LoginPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders login form', () => {
        render(<LoginPage />);
        expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    });

    it('shows error on login failure', async () => {
        api.login.mockRejectedValueOnce(new Error('Login failed'));
        render(<LoginPage />);
        fireEvent.change(screen.getByPlaceholderText(/username/i), { target: { value: 'user' } });
        fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'pass' } });
        fireEvent.click(screen.getByText(/login/i));
        await waitFor(() => {
            expect(screen.getByText(/login failed/i)).toBeInTheDocument();
        });
    });
});
