import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import LoginPage from '../src/pages/LoginPage';
import userReducer from '../src//userSlice';
import * as api from '../src/api';

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

describe('LoginPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders login form', () => {
        renderWithProviders(<LoginPage />)
        expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    });

    it('shows error on login failure', async () => {
        api.login.mockRejectedValueOnce(new Error('Login failed'));
        renderWithProviders(<LoginPage />)
        fireEvent.change(screen.getByPlaceholderText(/username/i), { target: { value: 'user' } });
        fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'pass' } });
        fireEvent.click(screen.getByRole('button', { name: /login/i }));
        await waitFor(() => {
            expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
        });
    });
});
