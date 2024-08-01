import React, { useEffect, useState } from 'react';
import { Container, Grid } from '@mui/material';
import Note from './Note';
import Masonry from 'react-masonry-css';
import CreateNoteModal from './CreateNoteModal';
import { useDispatch, useSelector } from 'react-redux';
import { initializeNote } from '../reducers/noteReducer';

const NoteList = () => {
  const [open, setOpen] = useState(false)
  const [editNote, setEditNote] = useState(false)

  const handleOpen = () => setOpen(true)
  const handleClose = () => {
    setOpen(false)
    setEditNote(false)
  }

  const dispatch = useDispatch()

  const notes = useSelector(state => state.notes)

  useEffect(() => {
    if (notes.length === 0) {
      dispatch(initializeNote())
    }
  }, [])

  const breakpointColumnsObj = {
    default: 3,
    1100: 2,
    700: 1,
  };

  return (
    <Container sx={{ marginTop: 4 }}>
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {notes.map(note => (
          <div key={note.id}>
            <Note
              note={note}
              handleOpen={handleOpen}
              setEditNote={setEditNote}
            />
          </div>
        ))}
      </Masonry>
      <CreateNoteModal
        noteModalOpen={open}
        handleNoteModalOpen={handleOpen}
        handleNoteModalClose={handleClose}
        editNote={editNote}
      />
    </Container>
  );
};

export default NoteList;
