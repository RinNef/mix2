import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Typography,
  Grid
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import ImageUpload from './ImageUpload';

export default function RoomsManager({ rooms = [], onChange }) {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [roomData, setRoomData] = useState({
    roomName: '',
    amenities: []
  });

  const handleAdd = () => {
    setSelectedRoom(null);
    setRoomData({
      roomName: '',
      amenities: []
    });
    setOpenDialog(true);
  };

  const handleEdit = (room, index) => {
    setSelectedRoom(index);
    setRoomData(room);
    setOpenDialog(true);
  };

  const handleDelete = (index) => {
    const newRooms = rooms.filter((_, i) => i !== index);
    onChange(newRooms);
  };

  const handleAmenityImageUpload = (files, index) => {
    const file = files[0];
    if (file) {
      const newAmenities = [...roomData.amenities];
      if (index !== undefined) {
        // Update existing amenity
        newAmenities[index] = {
          ...newAmenities[index],
          image: URL.createObjectURL(file),
          imageFile: file
        };
      } else {
        // Add new amenity
        newAmenities.push({
          name: '',
          image: URL.createObjectURL(file),
          imageFile: file
        });
      }
      setRoomData(prev => ({
        ...prev,
        amenities: newAmenities
      }));
    }
  };

  const handleSave = () => {
    const newRooms = [...rooms];
    if (selectedRoom !== null) {
      newRooms[selectedRoom] = roomData;
    } else {
      newRooms.push(roomData);
    }
    onChange(newRooms);
    setOpenDialog(false);
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="subtitle1">Rooms List</Typography>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={handleAdd}
        >
          Add Room
        </Button>
      </Box>

      <List>
        {rooms.map((room, index) => (
          <ListItem key={index} divider>
            <ListItemText
              primary={room.roomName}
              secondary={`${room.amenities?.length || 0} amenities`}
            />
            <ListItemSecondaryAction>
              <IconButton edge="end" onClick={() => handleEdit(room, index)}>
                <EditIcon />
              </IconButton>
              <IconButton edge="end" onClick={() => handleDelete(index)}>
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedRoom !== null ? 'Edit Room' : 'Add New Room'}
        </DialogTitle>
        <DialogContent>
          <Box py={2}>
            <TextField
              fullWidth
              label="Room Name"
              value={roomData.roomName}
              onChange={(e) => setRoomData(prev => ({
                ...prev,
                roomName: e.target.value
              }))}
              margin="normal"
            />

            <Typography variant="subtitle1" sx={{ mt: 3, mb: 2 }}>Amenities</Typography>

            <Grid container spacing={2}>
              {roomData.amenities.map((amenity, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Box
                    sx={{
                      border: '1px solid',
                      borderColor: 'grey.300',
                      borderRadius: 1,
                      p: 2
                    }}
                  >
                    <Box
                      sx={{
                        width: '100%',
                        height: 140,
                        backgroundImage: `url(${amenity.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        mb: 1
                      }}
                    />
                    <TextField
                      fullWidth
                      size="small"
                      label="Amenity Name"
                      value={amenity.name}
                      onChange={(e) => {
                        const newAmenities = [...roomData.amenities];
                        newAmenities[index] = {
                          ...amenity,
                          name: e.target.value
                        };
                        setRoomData(prev => ({
                          ...prev,
                          amenities: newAmenities
                        }));
                      }}
                    />
                    <Box mt={1} display="flex" justifyContent="flex-end">
                      <IconButton
                        size="small"
                        onClick={() => {
                          const newAmenities = roomData.amenities.filter((_, i) => i !== index);
                          setRoomData(prev => ({
                            ...prev,
                            amenities: newAmenities
                          }));
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </Grid>
              ))}
              <Grid item xs={12} sm={6} md={4}>
                <Box
                  sx={{
                    border: '2px dashed',
                    borderColor: 'grey.300',
                    borderRadius: 1,
                    p: 2,
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <ImageUpload
                    onUpload={(files) => handleAmenityImageUpload(files)}
                  />
                </Box>
              </Grid>
            </Grid>

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              <Button onClick={() => setOpenDialog(false)}>
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleSave}
              >
                Save Room
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}