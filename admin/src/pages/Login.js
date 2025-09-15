import React, { useState } from 'react';
import { Box, TextField, Button, Paper, Typography } from '@mui/material';
import { authApi } from '../api';

export default function Login({ onLogin }) {
  const [user, setUser] = useState('admin');
  const [pass, setPass] = useState('admin123');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    try {
      setLoading(true);
      const res = await authApi.login(user, pass);
      onLogin(res.data.token);
      setErr('');
    } catch (e) {
      console.error('Login error:', e);
      setErr(e.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 420, mx: 'auto' }}>
      <Typography variant="h6">Admin Login</Typography>
      <Box mt={2}>
        <TextField fullWidth label="Username" value={user} onChange={e => setUser(e.target.value)} />
      </Box>
      <Box mt={2}>
        <TextField fullWidth label="Password" type="password" value={pass} onChange={e => setPass(e.target.value)} />
      </Box>
      {err && <Box mt={1} color="error.main">{err}</Box>}
      <Box mt={2} display="flex" justifyContent="flex-end">
        <Button 
          variant="contained" 
          onClick={submit} 
          disabled={loading || !user || !pass}
        >
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </Box>
    </Paper>
  );
}
