import { useEffect, useState } from 'react';
import {
  Avatar,
  Button,
  Container,
  TextField,
  Typography,
  Grid,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Alert
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { useDispatch, useSelector } from 'react-redux';
import { getProfileUser, updateProfileUser } from '../reducers/userReducer';
import { storage } from '../firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const DisplayItem = ({label, value, handleEditClick}) => {
    return (
        <>
            <Grid item key={label} container alignItems="center" spacing={2}>
              <Grid item xs={3}>
                <Typography variant="body1">{label.charAt(0).toUpperCase() + label.slice(1)}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">{value}</Typography>
              </Grid>
              <Grid item xs={3}>
                <IconButton onClick={() => handleEditClick(label, value)}>
                  <EditIcon />
                </IconButton>
              </Grid>
            </Grid>
        </>
    )
}

const ProfilePage = () => {
  const dispatch = useDispatch()
  const profileUser = useSelector(state => state.user)
  const notification = useSelector(state => state.message)

  const [open, setOpen] = useState(false);
  const [currentField, setCurrentField] = useState('');
  const [currentValue, setCurrentValue] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState({
    username: '',
    name: '',
    email: '',
    password: '******',
    avatar: ''
  });

  useEffect(() => {
    dispatch(getProfileUser())
  }, [])

  useEffect(() => {
    if (profileUser) {
        setUser({
            ...user,
            username: profileUser.username,
            name: profileUser.name,
            email: profileUser.email,
            avatar: profileUser.avatar
        })
    }
  }, [profileUser])

  useEffect(() => {
    const fetchImage = async () => {
        try {
            if (user.avatar) {
                const avatarUrl = await getDownloadURL(ref(storage, user.avatar));
                setAvatarPreview(avatarUrl);
            }
            setLoading(false);
        }
        catch (error) {
            console.error('Error fetching user data:', error);
            setLoading(false);
        }
    }
    fetchImage()
  }, [user.avatar])

  const handleEditClick = (field, value) => {
    setCurrentField(field);
    setCurrentValue(value);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = async () => {
    if (currentField === 'avatar') {
        try {
            // Upload the avatar file to Firebase
            const avatarRef = ref(storage, `avatars/${user.username}`);
            await uploadBytes(avatarRef, currentValue);
            //const avatarUrl = await getDownloadURL(avatarRef);
    
            // Update the avatar URL in your backend
            const { password, ...userObject } = user
            dispatch(updateProfileUser({ ...userObject, [currentField]: `avatars/${user.username}` }))
            handleClose();
    
            // Update the avatar URL in the state
            //setUser({ ...user, avatar: `avatars/${user.username}` });
            //setAvatarPreview(avatarUrl);
        } catch (error) {
            console.error('Error uploading avatar:', error);
        }
    }
    else {
        const { password, ...userObject } = user
        dispatch(updateProfileUser({ ...userObject, [currentField]: currentValue }))
        handleClose();
    }
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
      handleEditClick('avatar', file);
    }
  };

  return (
    <Container>
      {
        notification.message && (
        <Alert variant="outlined" severity={notification.type}>
            {notification.message}
        </Alert>
        )
      }
      <Grid container justifyContent="center" alignItems="center" direction="column" spacing={3}>
        <Grid item>
        <Avatar alt={user.name} src={avatarPreview} sx={{ width: 100, height: 100 }} />
          <IconButton color="primary" component="label">
            <PhotoCamera />
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleAvatarChange}
            />
          </IconButton>
        </Grid>
        {Object.keys(user).map((key) => (
          key !== 'avatar' && (
            <DisplayItem key={key} label={key} value={user[key]} handleEditClick={handleEditClick} />
          )
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit {currentField.charAt(0).toUpperCase() + currentField.slice(1)}</DialogTitle>
        <DialogContent>
          {currentField === 'avatar' ? (
            <div>
              <Avatar alt="Avatar Preview" src={avatarPreview} sx={{ width: 100, height: 100, margin: 'auto' }} />
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                style={{ display: 'block', marginTop: 16 }}
              />
            </div>
          ) : (
            <TextField
              autoFocus
              margin="dense"
              label={currentField.charAt(0).toUpperCase() + currentField.slice(1)}
              type="text"
              fullWidth
              value={currentValue}
              onChange={(e) => setCurrentValue(e.target.value)}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
        </Dialog>
    </Container>
  );
};

export default ProfilePage;
