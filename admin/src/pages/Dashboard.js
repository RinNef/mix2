import React, { useEffect, useState } from 'react';
import { Typography, Box, Button, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import axios from 'axios';

export default function Dashboard({ token, onLogout }) {
  const [homestays, setHomestays] = useState([]);

  useEffect(() => {
    axios.get('/api/homestays').then(r => setHomestays(r.data)).catch(() => {});
  }, []);

  return (
    <div>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4">Admin Dashboard</Typography>
        <Button variant="outlined" onClick={onLogout}>Logout</Button>
      </Box>

      <Box mt={3}>
        <Typography variant="h6">Homestays</Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Images</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {homestays.map(h => (
              <TableRow key={h._id}>
                <TableCell>{h.name}</TableCell>
                <TableCell>{h.address}</TableCell>
                <TableCell>{h.images ? h.images.length : 0}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </div>
  );
}
