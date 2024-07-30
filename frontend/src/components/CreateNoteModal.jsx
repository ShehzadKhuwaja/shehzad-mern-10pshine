import React, { useState, useRef, useEffect } from 'react';
import {
  Modal,
  Box,
  Typography,
  IconButton,
  Button,
  Menu,
  MenuItem,
  TextField,
  Select,
  FormControl,
  InputLabel,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import ShareIcon from '@mui/icons-material/Share';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PinIcon from '@mui/icons-material/Pin';
import AlarmIcon from '@mui/icons-material/Alarm';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LabelIcon from '@mui/icons-material/Label';
import WidgetsIcon from '@mui/icons-material/Widgets';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import SearchIcon from '@mui/icons-material/Search';
import InfoIcon from '@mui/icons-material/Info';
import StarIcon from '@mui/icons-material/Star';
import ArchiveIcon from '@mui/icons-material/Archive';
import DeleteIcon from '@mui/icons-material/Delete';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useDispatch, useSelector } from 'react-redux';
import { createNote, updateNote } from '../reducers/noteReducer';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
};

const CreateNoteModal = ({ onSave, noteModalOpen, handleNoteModalClose, editNote = null}) => {
  //const [open, setOpen] = useState(false);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('uncategorized');
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [categories, setCategories] = useState(['uncategorized', 'work', 'personal', 'important']);

  const quillRef = useRef(null);
  const undoIntervalRef = useRef(null);
  const redoIntervalRef = useRef(null);

  const dispatch = useDispatch()
  console.log(content)

  useEffect(() => {
    if (editNote) {
      //console.log(note)
      setTitle(editNote.title || '');
      setContent(editNote.description || '');
      setCategory('uncategorized');
    } else {
      setTitle('');
      setContent('');
      setCategory('uncategorized');
    }
  }, [editNote]);

  //const handleOpen = () => setOpen(true);
  //const handleClose = () => setOpen(false);
  const handleMenuOpen = (event) => setMenuAnchorEl(event.currentTarget);
  const handleMenuClose = () => setMenuAnchorEl(null);

  const handleSave = () => {
    //onSave({ title, content, category });
    //const plainTextContent = quillRef.current.getEditor().getText();
    if (!editNote) {
      dispatch(createNote({ title, description: content }));
    }
    else {
      dispatch(updateNote({...editNote, title, description: content}));
    }
    setTitle('');
    setContent('');
    setCategory('uncategorized');
    handleNoteModalClose();
  };

  const handleAddCategory = () => {
    const newCategory = prompt('Enter new category:');
    if (newCategory) {
      setCategories([...categories, newCategory]);
    }
  };

  const handleUndo = () => {
    const editor = quillRef.current.getEditor();
    editor.history.undo();
  };

  const handleRedo = () => {
    const editor = quillRef.current.getEditor();
    editor.history.redo();
  };

  const startUndo = () => {
    handleUndo();
    undoIntervalRef.current = setInterval(handleUndo, 100);
  };

  const stopUndo = () => {
    clearInterval(undoIntervalRef.current);
  };

  const startRedo = () => {
    handleRedo();
    redoIntervalRef.current = setInterval(handleRedo, 100);
  };

  const stopRedo = () => {
    clearInterval(redoIntervalRef.current);
  };

  return (
    <div>
      <Modal
        open={noteModalOpen}
        onClose={handleNoteModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {/* First row: Undo/Redo, Share, Menu */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton
                onMouseDown={startUndo}
                onMouseUp={stopUndo}
                onMouseLeave={stopUndo}
              >
                <UndoIcon />
              </IconButton>
              <IconButton
                onMouseDown={startRedo}
                onMouseUp={stopRedo}
                onMouseLeave={stopRedo}
              >
                <RedoIcon />
              </IconButton>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton>
                <ShareIcon />
              </IconButton>
              <IconButton onClick={handleMenuOpen}>
                <MoreVertIcon />
              </IconButton>
              <Menu
                anchorEl={menuAnchorEl}
                open={Boolean(menuAnchorEl)}
                onClose={handleMenuClose}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5, marginLeft: '10px' }}>
                      <PinIcon fontSize="small" />
                      <Typography variant="caption" fontSize="small">Pin</Typography>
                    </Box>
                    <Divider orientation="vertical" flexItem />
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                      <AlarmIcon fontSize="small" />
                      <Typography variant="caption" fontSize="small">Reminder</Typography>
                    </Box>
                    <Divider orientation="vertical" flexItem />
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5, marginRight: '10px' }}>
                      <LockIcon fontSize="small" />
                      <Typography variant="caption" fontSize="small">Lock</Typography>
                    </Box>
                  </Box>
                  <Divider sx={{ width: '100%' }}/>
                  <List sx={{ width: '100%', p: 0 }}>
                    <ListItem button>
                      <ListItemIcon>
                        <VisibilityIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primaryTypographyProps={{ fontSize: 'small' }} primary="Reading Mode" />
                    </ListItem>
                    <ListItem button>
                      <ListItemIcon>
                        <LabelIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primaryTypographyProps={{ fontSize: 'small' }} primary="Add Tags" />
                    </ListItem>
                    <ListItem button>
                      <ListItemIcon>
                        <WidgetsIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primaryTypographyProps={{ fontSize: 'small' }} primary="Add Widget" />
                    </ListItem>
                    <ListItem button>
                      <ListItemIcon>
                        <PictureAsPdfIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primaryTypographyProps={{ fontSize: 'small' }} primary="Export to PDF" />
                    </ListItem>
                    <ListItem button>
                      <ListItemIcon>
                        <SearchIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primaryTypographyProps={{ fontSize: 'small' }} primary="Search" />
                    </ListItem>
                    <ListItem button>
                      <ListItemIcon>
                        <InfoIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primaryTypographyProps={{ fontSize: 'small' }} primary="Note Details" />
                    </ListItem>
                    <ListItem button>
                      <ListItemIcon>
                        <StarIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primaryTypographyProps={{ fontSize: 'small' }} primary="Add to Favorites" />
                    </ListItem>
                    <ListItem button>
                      <ListItemIcon>
                        <ArchiveIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primaryTypographyProps={{ fontSize: 'small' }} primary="Archive" />
                    </ListItem>
                    <ListItem button>
                      <ListItemIcon>
                        <DeleteIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primaryTypographyProps={{ fontSize: 'small' }} primary="Delete" />
                    </ListItem>
                  </List>
                </Box>
              </Menu>
            </Box>
          </Box>

          {/* Second row: Edit time, Category dropdown */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2">Last edited: {new Date().toLocaleString()}</Typography>
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                label="Category"
              >
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
                <MenuItem onClick={handleAddCategory}>Add new category</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Third row: Title */}
          <TextField
            label="Title"
            variant="outlined"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {/* Main body: Rich text editor */}
          <ReactQuill
            ref={quillRef}
            value={content}
            onChange={setContent}
            modules={{
              toolbar: [
                [{ header: '1' }, { header: '2' }, { font: [] }],
                [{ size: [] }],
                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                [{ list: 'ordered' }, { list: 'bullet' }],
                ['link', 'image'],
                ['clean'],
              ],
              history: {
                delay: 1000,
                maxStack: 50,
                userOnly: true,
              },
            }}
          />

          {/* Save button */}
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default CreateNoteModal;
