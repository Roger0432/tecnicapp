import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TextField, Button } from '@mui/material';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function IniciSessio() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
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

    if (email === '' || password === '') {
      setError("Has d'omplir tots els camps");
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
        }
      })
      .catch(error => {
        console.error('Error:', error);
        setError('Error del servidor');
      });
  }

  return (
    <div className='page'>
      <h2>INICI DE SESSIÓ</h2>
      <form id="login-form" onSubmit={handleLogin}>
        <div className="form-group">
          <TextField 
            id="lg-email" 
            label="Correu electrònic" 
            type="email" 
            autoComplete="username" 
            value={email}
            onChange={handleEmailChange}
          />
          <br />
          <TextField
            id="lg-password" 
            label="Contrasenya" 
            type="password" 
            autoComplete="current-password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        
        <Button variant="contained" type="submit">Entra</Button>

      </form>
      {/*<Link to="/registre">No tens compte? Registra't aquí.</Link>*/}
      <Button variant="text" component={Link} to="/registre">No tens compte? Registra't aquí.</Button>
      <div className="error">{error}</div>
    </div>
  );
}

export default IniciSessio;
