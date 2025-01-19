import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Link, Alert, Paper, Box } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      setSuccessMessage('Login successful! Redirecting...');
      setTimeout(() => {
        navigate('/');
      }, 2000); 
    } catch (error) {
      if (error.response && error.response.data) {
        setError('Invalid email or password');
      } else {
        setError('Server error');
      }
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '90vh',
        backgroundColor: '#f4f6f8',
      }}
    >
      <Container maxWidth="xs">
        <Paper sx={{ padding: 3, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold', color: '#333' }}>
            Login
          </Typography>

          {successMessage && (
            <Alert severity="success" sx={{ marginBottom: 2, fontWeight: 'bold' }}>
              {successMessage}
            </Alert>
          )}

          {error && (
            <Alert severity="error" sx={{ marginBottom: 2, fontWeight: 'bold' }}>
              {error}
            </Alert>
          )}

          <TextField
            label="Email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            sx={{ borderRadius: '8px' }}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            sx={{ borderRadius: '8px' }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleLogin}
            sx={{
              marginTop: 2,
              borderRadius: '8px',
              padding: '10px 0',
              fontSize: '16px',
              textTransform: 'none',
              fontWeight: 'bold',
              boxShadow: 3,
            }}
          >
            Login
          </Button>
          <Typography variant="body2" align="center" mt={2}>
            Don't have an account? <Link href="/register" sx={{ fontWeight: 'bold' }}>Register here</Link>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}

export default LoginPage;
