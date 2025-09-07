import { render, screen } from '@testing-library/react';
import NotFoundPage from '../src/pages/NotFoundPage';

describe('NotFoundPage', () => {
    it('renders not found message', () => {
        render(<NotFoundPage />);
        expect(screen.getByText(/not found/i)).toBeInTheDocument();
    });
});
