import React, { useState } from 'react';
import { Box, Button, Avatar, Typography } from '@mui/material';
import { styled } from '@mui/system';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const Input = styled('input')({
  display: 'none',
});

const UploadAvatar = ({ onSkip, onNext }) => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
      <Typography variant="h6">Upload Your Avatar</Typography>
      {preview ? (
        <Avatar alt="Avatar Preview" src={preview} sx={{ width: 120, height: 120 }} />
      ) : (
        <AccountCircleIcon sx={{ width: 120, height: 120 }} />
      )}
      <label htmlFor="upload-button">
        <Input
          accept="image/*"
          id="upload-button"
          type="file"
          onChange={handleImageUpload}
        />
        <Button variant="contained" component="span" sx={{ m: 1, width: '36ch' }}>
          Upload Image
        </Button>
      </label>
      {image && <Typography variant="body2">{image.name}</Typography>}
      <Box display="flex" flexDirection="row" gap={1} justifyContent="space-between" sx={{ m: 1, width: '36ch' }}>
        <Button variant="contained" onClick={onSkip} sx={{ flexGrow: 1 }}>
            Skip Now
        </Button>
        <Button variant='contained' onClick={onNext} sx={{ flexGrow: 1 }}>Next</Button>
      </Box>
    </Box>
  );
};

export default UploadAvatar;
