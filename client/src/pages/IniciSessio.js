import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

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

    fetch(`${BACKEND_URL}/login`, {
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
          <label htmlFor="lg-email">Correu electrònic</label>
          <input 
            type="text"
            id="lg-email" 
            name="lg-email" 
            placeholder="Correu electrònic" 
            autoComplete="username" 
            value={email}
            onChange={handleEmailChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="lg-password">Contrasenya</label>
          <input 
            type="password" 
            id="lg-password" 
            name="lg-password" 
            placeholder="Contrasenya" 
            autoComplete="current-password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <button id="login-btn" type="submit">Entra</button>
      </form>
      <Link to="/registre">No tens compte? Registra't aquí.</Link>
      <div className="error">{error}</div>
    </div>
  );
}

export default IniciSessio;
