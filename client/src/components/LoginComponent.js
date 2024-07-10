import React, { useState } from 'react';
import '../index.css'

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const LoginComponent = ({ canviarMostrarLogin, onAuthSuccess }) => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleEmailChange = (event) => setEmail(event.target.value);
  const handlePasswordChange = (event) => setPassword(event.target.value);

  const handleLogin = async (event) => {
    event.preventDefault();
    setError('');

    if (email === '' || password === '') {
      setError('Has d\'omplir tots els camps');
      return;
    }

    const data = { email, password };
    const response = await fetch(`${BACKEND_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      setError(error.msg);
      return;
    }

    onAuthSuccess();
  }

  return (
    <div>

      <h2>INICIAR SESSIÓ</h2>

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
          required
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
          required
        />
      </div>

      <button id="login-btn" onClick={handleLogin}>Entra</button>
      <br></br>
      <a href="#registre" onClick={(event) => { event.preventDefault(); canviarMostrarLogin(); }} aria-label="Registra't aquí si no tens compte.">No tens compte? Registra't aquí.</a>

      <br></br>
      <div className="error">{error}</div>

    </div>
  )
}

export default LoginComponent;