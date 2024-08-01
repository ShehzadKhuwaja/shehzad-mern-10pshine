import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Note from './Note';
import { deleteNote } from '../reducers/noteReducer';

jest.mock('../reducers/noteReducer', () => ({
  deleteNote: jest.fn()
}));

const mockStore = configureStore([]);
const note = {
  id: '1',
  description: '<p>This is a test note</p>',
  title: 'Test Note'
};

describe('Note component', () => {
  let store;
  let handleOpen;
  let setEditNote;

  beforeEach(() => {
    store = mockStore({
      notes: []
    });

    handleOpen = jest.fn();
    setEditNote = jest.fn();

    render(
      <Provider store={store}>
        <Note note={note} handleOpen={handleOpen} setEditNote={setEditNote} />
      </Provider>
    );
  });

  it('should render note description', () => {
    const description = screen.getByText(/This is a test note/i);
    expect(description).toBeInTheDocument();
  });

  it('should call setEditNote and handleOpen on edit button click', () => {
    const editButton = screen.getByTestId('edit-button');
    fireEvent.click(editButton);

    expect(setEditNote).toHaveBeenCalledWith(note);
    expect(handleOpen).toHaveBeenCalled();
  });

  it('should call handleShareClick on share button click', () => {
    const shareButton = screen.getByTestId('share-button');
    fireEvent.click(shareButton);

    // Add your share button click handler expectations here
  });
});
