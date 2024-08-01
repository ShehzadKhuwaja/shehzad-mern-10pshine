import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { BrowserRouter } from 'react-router-dom';
import Login from './Login';
import { setLogin } from '../reducers/authenticationReducer';

const mockStore = configureMockStore([]);

jest.mock('../reducers/authenticationReducer', () => ({
  setLogin: jest.fn(),
}));

describe('Login Component', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      message: null,
    });
    store.dispatch = jest.fn();
  });

  const renderComponent = () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </Provider>
    );
  };

  test('renders login form', () => {
    renderComponent();

    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByTestId('form-password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByText(/forget password\?/i)).toBeInTheDocument();
  });

  test('validates form inputs', async () => {
    renderComponent();

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByText(/Username is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Password is required/i)).toBeInTheDocument();
  });

  test('toggles password visibility', () => {
    const { container } = render(
        <Provider store={store}>
          <BrowserRouter>
            <Login />
          </BrowserRouter>
        </Provider>
    );

    screen.debug()

    const passwordInput = container.querySelector('#outlined-adornment-password');
    const visibilityToggle = screen.getByTestId('icon-button-password');

    expect(passwordInput).toHaveAttribute('type', 'password');

    fireEvent.click(visibilityToggle);
    expect(passwordInput).toHaveAttribute('type', 'text');

    fireEvent.click(visibilityToggle);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('dispatches login action on form submission', async () => {
    const { container } = render(
        <Provider store={store}>
          <BrowserRouter>
            <Login />
          </BrowserRouter>
        </Provider>
    );

    screen.debug()

    fireEvent.change(container.querySelector('#outlined-basic'), { target: { value: 'testuser' } });
    fireEvent.change(container.querySelector('#outlined-adornment-password'), { target: { value: 'password' } });

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(setLogin('testuser', 'password'));
    });

    expect(container.querySelector('#outlined-basic')).toHaveValue('');
    expect(container.querySelector('#outlined-adornment-password')).toHaveValue('');
  });

  test('displays notification message', () => {
    store = mockStore({
      message: { type: 'error', message: 'Invalid credentials' },
    });
    store.dispatch = jest.fn();

    render(
      <Provider store={store}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
  });
});
