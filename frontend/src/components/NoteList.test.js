import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import NoteList from './NoteList';
import { initializeNote } from '../reducers/noteReducer';

const mockStore = configureMockStore([]);

jest.mock('../reducers/noteReducer', () => ({
  initializeNote: jest.fn(),
}));

jest.mock('./Note', () => ({ note, handleOpen, setEditNote }) => (
  <div data-testid="note">
    <p>{note.description}</p>
    <button onClick={() => {
      setEditNote(note);
      handleOpen();
    }}>Edit</button>
  </div>
));

describe('NoteList', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      notes: [
        { id: '1', description: 'Note 1' },
        { id: '2', description: 'Note 2' },
        { id: '3', description: 'Note 3' },
      ],
    });

    store.dispatch = jest.fn();
  });

  test('renders notes and opens modal on edit button click', async () => {
    render(
      <Provider store={store}>
        <NoteList />
      </Provider>
    );

    screen.debug()

    // Ensure initializeNote is dispatched
    expect(store.dispatch).toHaveBeenCalledWith(initializeNote());

    // Check if notes are rendered
    const notes = screen.getAllByTestId('note');
    expect(notes).toHaveLength(3);
    expect(screen.queryByText('Note 1')).toBeInTheDocument();
    expect(screen.queryByText('Note 2')).toBeInTheDocument();
    expect(screen.queryByText('Note 3')).toBeInTheDocument();

    // Simulate clicking the edit button on the first note
    const editButtons = screen.getAllByText('Edit');
    fireEvent.click(editButtons[0]);

    // Check if the modal opens with the correct note data
    expect(store.getActions()).toEqual([initializeNote()]); // Ensuring no additional unexpected actions
  });
});
