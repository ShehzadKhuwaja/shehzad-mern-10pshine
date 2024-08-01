import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import CreateNoteModal from './CreateNoteModal';
import { createNote, updateNote } from '../reducers/noteReducer';

const mockStore = configureMockStore([]);

jest.mock('../reducers/noteReducer', () => ({
  createNote: jest.fn(),
  updateNote: jest.fn(),
}));

describe('CreateNoteModal', () => {
  let store;
  let onSave;
  let handleNoteModalClose;

  beforeEach(() => {
    store = mockStore({
      user: {
        username: 'testuser',
      },
      note: {
        notes: [],
      },
    });

    store.dispatch = jest.fn();
    onSave = jest.fn();
    handleNoteModalClose = jest.fn();
  });

  const renderComponent = (noteModalOpen, editNote = null) => {
    render(
      <Provider store={store}>
        <CreateNoteModal 
          onSave={onSave}
          noteModalOpen={noteModalOpen}
          handleNoteModalClose={handleNoteModalClose}
          editNote={editNote}
        />
      </Provider>
    );
  };

  test('renders the CreateNoteModal component', () => {
    renderComponent(true);
    expect(screen.getByLabelText(/Title/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
  });

  test('saves a new note', async () => {
    renderComponent(true);

    fireEvent.change(screen.getByLabelText(/Title/i), { target: { value: 'New Note' } });
    //fireEvent.change(screen.getByLabelText(/Category/i), { target: { value: 'work' } });
    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(createNote({
        title: 'New Note',
        description: '',
      }));
    });
  });

  test('updates an existing note', async () => {
    const editNote = {
      id: 1,
      title: 'Existing Note',
      description: 'Existing content',
    };

    renderComponent(true, editNote);

    fireEvent.change(screen.getByLabelText(/Title/i), { target: { value: 'Updated Note' } });
    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(updateNote({
        id: 1,
        title: 'Updated Note',
        description: 'Existing content',
      }));
    });
  });

  test('closes the modal on save', async () => {
    renderComponent(true);

    fireEvent.change(screen.getByLabelText(/Title/i), { target: { value: 'New Note' } });
    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(handleNoteModalClose).toHaveBeenCalled();
    });
  });

  test('adds a new category', () => {
    renderComponent(true);

    fireEvent.mouseDown(screen.getByLabelText(/Category/i));
    fireEvent.click(screen.getByText(/Add new category/i));

    window.prompt = jest.fn().mockReturnValue('new category');
    fireEvent.click(screen.getByText(/Add new category/i));

    expect(screen.getByText('new category')).toBeInTheDocument();
  });

  test('displays last edited time', () => {
    renderComponent(true);
    const lastEditedText = new RegExp(`Last edited: ${new Date().toLocaleString()}`, 'i');
    expect(screen.getByText(lastEditedText)).toBeInTheDocument();
  });
});
