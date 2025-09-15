import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Typography,
  CircularProgress
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { homestaysApi } from '../api';
import HomeStayForm from './HomeStayForm';

export default function HomestayManager() {
  const [homestays, setHomestays] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [selectedHomestay, setSelectedHomestay] = useState(null);

  const loadHomestays = async () => {
    try {
      setLoading(true);
      const { data } = await homestaysApi.list();
      setHomestays(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load homestays');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHomestays();
  }, []);

  const handleAdd = () => {
    setSelectedHomestay(null);
    setOpenForm(true);
  };

  const handleEdit = (homestay) => {
    setSelectedHomestay(homestay);
    setOpenForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this homestay?')) return;
    try {
      await homestaysApi.delete(id);
      await loadHomestays();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete homestay');
    }
  };

  const handleSave = async (formData) => {
    try {
      if (selectedHomestay) {
        await homestaysApi.update(selectedHomestay._id, formData);
      } else {
        await homestaysApi.create(formData);
      }
      setOpenForm(false);
      await loadHomestays();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save homestay');
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Homestays</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAdd}
        >
          Add New
        </Button>
      </Box>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Address</TableCell>
            <TableCell>Rooms</TableCell>
            <TableCell>Images</TableCell>
            <TableCell width={120}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {homestays.map((homestay) => (
            <TableRow key={homestay._id}>
              <TableCell>{homestay.name}</TableCell>
              <TableCell>{homestay.address}</TableCell>
              <TableCell>{homestay.rooms?.length || 0}</TableCell>
              <TableCell>{homestay.images?.length || 0}</TableCell>
              <TableCell>
                <IconButton onClick={() => handleEdit(homestay)} size="small">
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDelete(homestay._id)} size="small" color="error">
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedHomestay ? 'Edit Homestay' : 'Add New Homestay'}
        </DialogTitle>
        <DialogContent>
          <HomeStayForm
            initialData={selectedHomestay}
            onSave={handleSave}
            onCancel={() => setOpenForm(false)}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
}