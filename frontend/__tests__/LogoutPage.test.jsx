import { render, screen } from '@testing-library/react';
import LogoutPage from '../src/pages/LogoutPage';

describe('LogoutPage', () => {
    it('renders logout message', () => {
        render(<LogoutPage />);
        expect(screen.getByText(/logged out/i)).toBeInTheDocument();
    });
});
