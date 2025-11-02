import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from '../src/pages/Home';

describe('Home Page', () => {
    it('renders welcome message', () => {
        render(
            <MemoryRouter>
                <Home />
            </MemoryRouter>
        );
        const welcomeElement = screen.getByText(/welcome/i);
        expect(welcomeElement).toBeInTheDocument();
    });
});
