import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Alert, Typography } from '@mui/material';
import { Collapse, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function IniciSessio() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authtoken');
    if (token) {
      navigate('/main');
    }
  }, [navigate]);

  const handleEmailChange = (event) => setEmail(event.target.value);
  const handlePasswordChange = (event) => setPassword(event.target.value);

  const handleLogin = async (event) => {
    event.preventDefault();
    setError('');
    setOpen(false);

    if (email === '' || password === '') {
      setError("Has d'omplir tots els camps");
      setOpen(true);
      return;
    }

    fetch(`${BACKEND_URL}/inicisessio`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
      .then(response => response.json())
      .then(data => {
        if (data.status) {
          const token = data.authtoken;
          localStorage.setItem('email', email);
          localStorage.setItem('authtoken', token);
          navigate('/main');
        } else {
          localStorage.clear();
          setError(data.msg);
          setOpen(true);
        }
      })
      .catch(error => {
        console.error('Error:', error);
        setError('Error del servidor');
        setOpen(true);
      });
  }

  return (
    <Box m={4} display="flex" justifyContent="center">
      <Box component="form" id="login-form" onSubmit={handleLogin} sx={{ width: '100%', maxWidth: '400px' }}>
        <Box className="form-group" display="flex" flexDirection="column" gap={2}>
            <Typography variant="h5" mb={2} mt={2} sx={{ fontWeight: 'bold' }}>INICI DE SESSIÓ</Typography>
            <TextField 
              id="lg-email" 
              label="Correu electrònic" 
              type="email" 
              autoComplete="username" 
              value={email}
              onChange={handleEmailChange}
            />
            <TextField
              id="lg-password" 
              label="Contrasenya" 
              type="password" 
              autoComplete="current-password"
              value={password}
              onChange={handlePasswordChange}
            />

            <Button variant="contained" type="submit">Entra</Button>
            <Button variant="text" component={Link} to="/registre">No tens compte? Registra't aquí.</Button>

            <Box sx={{ width: '100%' }}>
            <Collapse in={open}>
              <Alert
                variant="filled"
                severity="error"
                action={
                  <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={() => {
                      setOpen(false);
                    }}
                  >
                    <CloseIcon fontSize="inherit" />
                  </IconButton>
                }
                sx={{ mb: 2 }}
              >
                {error}
              </Alert>
            </Collapse>
          </Box>

          </Box>
      </Box>
    </Box>
  );
}

export default IniciSessio;
