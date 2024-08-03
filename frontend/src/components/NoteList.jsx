import React, { useEffect, useState } from 'react';
import { Container, Grid } from '@mui/material';
import Note from './Note';
import Masonry from 'react-masonry-css';
import CreateNoteModal from './CreateNoteModal';
import { useDispatch, useSelector } from 'react-redux';
import { initializeNote } from '../reducers/noteReducer';
import { useMatch } from 'react-router-dom';

const isSameDate = (date1, date2) => {
  return date1.getUTCFullYear() === date2.getUTCFullYear() &&
         date1.getUTCMonth() === date2.getUTCMonth() &&
         date1.getUTCDate() === date2.getUTCDate();
};

const NoteList = ({ currentDate = new Date() }) => {
  const [open, setOpen] = useState(false)
  const [editNote, setEditNote] = useState(false)

  const match = useMatch('/calendar')

  const handleOpen = () => setOpen(true)
  const handleClose = () => {
    setOpen(false)
    setEditNote(false)
  }

  const dispatch = useDispatch()

  const notes = useSelector(state => state.notes)
  console.log(notes.filter(note => note.calendarDate))
  const calendarNotes = match && notes.filter(note => note.calendarDate).filter(note => {
    const noteDate = new Date(note.calendarDate)
    return noteDate.toDateString() === currentDate.toDateString()
  })

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
        {(!match ? notes : calendarNotes).map(note => (
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
        currentDate={currentDate}
      />
    </Container>
  );
};

export default NoteList;
