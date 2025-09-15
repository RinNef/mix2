import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Grid,
  Typography,
  Paper,
  IconButton
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import ImageUpload from './ImageUpload';
import MapPreview from './MapPreview';
import RoomsManager from './RoomsManager';

export default function HomeStayForm({ initialData, onSave, onCancel }) {
  const [data, setData] = useState({
    name: '',
    address: '',
    googleMapEmbed: '',
    images: [],
    rooms: [],
    contact: {
      phone: '',
      email: '',
      zalo: ''
    },
    ...initialData
  });

  const handleChange = (field) => (event) => {
    setData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleContactChange = (field) => (event) => {
    setData(prev => ({
      ...prev,
      contact: {
        ...prev.contact,
        [field]: event.target.value
      }
    }));
  };

  const handleImageUpload = (files) => {
    // Handle multiple file uploads
    const newImages = Array.from(files).map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    setData(prev => ({
      ...prev,
      images: [...prev.images, ...newImages]
    }));
  };

  const handleRemoveImage = (index) => {
    setData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleRoomsChange = (rooms) => {
    setData(prev => ({
      ...prev,
      rooms
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    
    // Append basic fields
    formData.append('name', data.name);
    formData.append('address', data.address);
    formData.append('googleMapEmbed', data.googleMapEmbed);
    formData.append('contact', JSON.stringify(data.contact));
    
    // Append rooms
    formData.append('rooms', JSON.stringify(data.rooms));
    
    // Append images
    data.images.forEach(img => {
      if (img.file) {
        formData.append('images', img.file);
      }
    });

    onSave(formData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            required
            fullWidth
            label="Name"
            value={data.name}
            onChange={handleChange('name')}
            margin="normal"
          />
          <TextField
            required
            fullWidth
            label="Address"
            value={data.address}
            onChange={handleChange('address')}
            margin="normal"
          />
          
          <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Contact Information</Typography>
          <TextField
            fullWidth
            label="Phone"
            value={data.contact.phone}
            onChange={handleContactChange('phone')}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={data.contact.email}
            onChange={handleContactChange('email')}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Zalo Link"
            value={data.contact.zalo}
            onChange={handleContactChange('zalo')}
            margin="normal"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h6" sx={{ mb: 1 }}>Google Maps</Typography>
          <TextField
            fullWidth
            label="Google Maps Embed Code"
            multiline
            rows={4}
            value={data.googleMapEmbed}
            onChange={handleChange('googleMapEmbed')}
            margin="normal"
          />
          <MapPreview embedCode={data.googleMapEmbed} />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6" sx={{ mb: 1 }}>Images</Typography>
          <ImageUpload onUpload={handleImageUpload} />
          
          <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {data.images.map((img, index) => (
              <Paper key={index} sx={{ position: 'relative' }}>
                <img
                  src={img.preview || img}
                  alt={`Preview ${index}`}
                  style={{ width: 100, height: 100, objectFit: 'cover' }}
                />
                <IconButton
                  size="small"
                  sx={{ position: 'absolute', top: 0, right: 0, bgcolor: 'background.paper' }}
                  onClick={() => handleRemoveImage(index)}
                >
                  <DeleteIcon />
                </IconButton>
              </Paper>
            ))}
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6" sx={{ mb: 1 }}>Rooms</Typography>
          <RoomsManager
            rooms={data.rooms}
            onChange={handleRoomsChange}
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
        <Button onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
        >
          Save
        </Button>
      </Box>
    </Box>
  );
}