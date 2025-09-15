import React, { useState } from 'react';
import { Container, Box } from '@mui/material';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import HomestayManager from './components/HomestayManager';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  
  if (!token) {
    return (
      <Container maxWidth="sm">
        <Box mt={4}>
          <Login onLogin={t => { localStorage.setItem('token', t); setToken(t); }} />
        </Box>
      </Container>
    );
  }
  
  return (
    <Container>
      <Box mt={4}>
        <Dashboard token={token} onLogout={() => { localStorage.removeItem('token'); setToken(null); }}>
          <HomestayManager />
        </Dashboard>
      </Box>
    </Container>
  );
}
