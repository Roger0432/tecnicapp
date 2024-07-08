import React, { useState } from 'react';
import '../index.css'

export const LoginComponent = ({ canviarMostrarLogin }) => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

    const handleEmailChange = (event) => {
      setEmail(event.target.value);
    };
  
    const handlePasswordChange = (event) => {
      setPassword(event.target.value);
    };

  const handleLogin = async (event) => {
    event.preventDefault();
    setError('');
    const data = { email, password };
    const response = await fetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      const error = await response.json();
      setError(error.error);
      return;
    }
  }

  return (
    <div>

      <h2>LOGIN</h2>

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

      <button id="login-btn" onClick={handleLogin}>Iniciar sessió</button>
      <br></br>
      <a href="#registre" onClick={canviarMostrarLogin}>No tens compte? Registra't aquí.</a>
      <br></br>
      <div className="error">{error}</div>

    </div>
  )
}

export default LoginComponent;