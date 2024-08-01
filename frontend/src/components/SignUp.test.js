// SignUp.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SignUp from './SignUp';

// Mock the setProgress function
const setProgress = jest.fn();

describe('SignUp Component', () => {

    test('renders SignUp component correctly', () => {
        render(<SignUp setProgress={setProgress} />);
        expect(screen.getByText(/Sign up/i)).toBeInTheDocument();
    });

    test('displays validation errors when required fields are empty', async () => {
        render(<SignUp setProgress={setProgress} />);
        fireEvent.click(screen.getByText('Next'));

        expect(await screen.findByText('Username is required')).toBeInTheDocument();
        expect(await screen.findByText('Name is required')).toBeInTheDocument();
        expect(await screen.findByText('Email is required')).toBeInTheDocument();
        expect(await screen.findByText('Password is required')).toBeInTheDocument();
    });

    test('displays error when passwords do not match', async () => {
        const { container } = render(<SignUp setProgress={setProgress} />);
        screen.debug()
        //container.querySelector
        fireEvent.change(container.querySelector('#outlined-adornment-password-signup'), { target: { value: 'password1' } });
        fireEvent.change(container.querySelector('#outlined-adornment-retypepassword-signup'), { target: { value: 'password2' } });

        fireEvent.click(screen.getByText('Next'));

        expect(await screen.findByText('Passwords do not match')).toBeInTheDocument();
    });

    test('proceeds to the next step when the form is valid', async () => {
        const { container } = render(<SignUp setProgress={setProgress} />);
        screen.debug()

        fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByLabelText('name'), { target: { value: 'Test User' } });
        fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
        fireEvent.change(container.querySelector('#outlined-adornment-password-signup'), { target: { value: 'password1' } });
        fireEvent.change(container.querySelector('#outlined-adornment-retypepassword-signup'), { target: { value: 'password1' } });

        fireEvent.click(screen.getByText('Next'));

        await waitFor(() => {
            expect(screen.getByText('Upload Avatar')).toBeInTheDocument();
        });
    });

    test('shows success message on successful signup', async () => {
        const { container } = render(<SignUp setProgress={setProgress} />);
        screen.debug()

        // Fill the form
        fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByLabelText('name'), { target: { value: 'Test User' } });
        fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
        fireEvent.change((container.querySelector('#outlined-adornment-password-signup')), { target: { value: 'password1' } });
        fireEvent.change(container.querySelector('#outlined-adornment-retypepassword-signup'), { target: { value: 'password1' } });

        // Proceed to the next step
        fireEvent.click(screen.getByText('Next'));

        await waitFor(() => {
            expect(screen.getByText('Upload Avatar')).toBeInTheDocument();
        });

        // Mock userService.signup function to resolve successfully
        jest.mock('../services/user', () => ({
            signUp: jest.fn().mockResolvedValue({ data: 'success' }),
        }));

        // Click sign up button
        fireEvent.click(screen.getByText('SIGN UP'));

        await waitFor(() => {
            expect(screen.getByText('Sign up successful')).toBeInTheDocument();
        });
    });

    test.only('shows error message on failed signup', async () => {
        const { container } = render(<SignUp setProgress={setProgress} />);
        screen.debug()

        // Fill the form
        fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByLabelText('name'), { target: { value: 'Test User' } });
        fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
        fireEvent.change((container.querySelector('#outlined-adornment-password-signup')), { target: { value: 'password1' } });
        fireEvent.change(container.querySelector('#outlined-adornment-retypepassword-signup'), { target: { value: 'password1' } });

        // Proceed to the next step
        fireEvent.click(screen.getByText('Next'));

        await waitFor(() => {
            expect(screen.getByText('Upload Avatar')).toBeInTheDocument();
        });

        // Mock userService.signup function to reject
        jest.mock('../services/user', () => ({
            signUp: jest.fn().mockRejectedValue({
                response: { data: { error: 'User creation failed' } },
            }),
        }));

        // Click sign up button
        fireEvent.click(screen.getByText('SIGN UP'));

        await waitFor(() => {
            expect(screen.getByText('User creation failed')).toBeInTheDocument();
        });
    });
});
