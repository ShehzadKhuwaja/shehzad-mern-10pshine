import React, { useState } from 'react';
import { Card, CardContent, Typography, IconButton, CardActions, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ShareIcon from '@mui/icons-material/Share';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
//import ReactQuill from 'react-quill';
//import 'react-quill/dist/quill.snow.css';
import CreateNoteModal from './CreateNoteModal';
import { useDispatch } from 'react-redux';
import { deleteNote } from '../reducers/noteReducer';

const Note = ({ note, handleOpen, setEditNote }) => {
  
  const dispatch = useDispatch()

  const handleEditClick = () => {
    setEditNote(note)
    handleOpen()
  };

  const handleDeleteClick = () => {
    dispatch(deleteNote(note))
  };

  const handleShareClick = () => {
  };

  return (
    <Card sx={{ minWidth: 275, marginBottom: 2 }}>
      <CardContent>
        <Typography variant="body2" dangerouslySetInnerHTML={{ __html: note.description }} className='note-description' />
      </CardContent>
      <CardActions>
        <IconButton color="primary" onClick={handleEditClick} data-testid="edit-button">
          <EditIcon />
        </IconButton>
        <IconButton color="primary" onClick={handleShareClick} data-testid="share-button">
          <ShareIcon />
        </IconButton>
        <IconButton color="secondary" onClick={handleDeleteClick} data-testid="delete-button">
          <DeleteIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default Note;
