import React, { useState } from 'react';
import { TextField, Button, Container, Typography,Link, Alert, Box, Paper } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      setError(null);
      setSuccessMessage('');

      if (!name || !email || !password) {
        setError('All fields are required');
        return;
      }

      if (!/\S+@\S+\.\S+/.test(email)) {
        setError('Invalid email format');
        return;
      }

      const response = await axios.post('http://localhost:8080/api/auth/register', { name, email, password });
      console.log(response)
      setSuccessMessage('Registration successful! You can now log in.');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.message);
      } else {
        setError('Server error');
      }
    }
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '90vh',
        }}
      >
        <Paper sx={{ padding: 3, display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
          <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold', color: '#333' }}>
            Register
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
            label="Name"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            margin="normal"
            sx={{
              borderRadius: '8px',
              backgroundColor: '#fff',
            }}
          />
          <TextField
            label="Email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            sx={{
              borderRadius: '8px',
              backgroundColor: '#fff',
            }}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            sx={{
              borderRadius: '8px',
              backgroundColor: '#fff',
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleRegister}
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
            Register
          </Button>
          <Typography variant="body2" align="center" mt={2}>
            Do you have an account? <Link href="/login" sx={{ fontWeight: 'bold' }}>Login here</Link>
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}

export default RegisterPage;
