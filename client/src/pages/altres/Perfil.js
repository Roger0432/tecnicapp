import React, { useState, useEffect } from 'react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function Perfil() {

  const [dades, setDades] = useState({
    nom: '',
    cognoms: '',
    email: '',
    rol: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('authtoken');
    const email = localStorage.getItem('email');

    fetch(`${BACKEND_URL}/perfil`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ email: email })
    })
    .then(response => response.json())
    .then(data => {
      if (data.status) {
        setDades(data.dades);
      } else {
        console.error('Error:', data.message);
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }, []);

  return (
    <div className='page'>

      <h1>Perfil</h1>

      <div>
        <p><strong>Nom:</strong> {dades.nom}</p>
        <p><strong>Cognoms:</strong> {dades.cognoms}</p>
        <p><strong>Correu electrònic:</strong> {dades.email}</p>
        <p><strong>Rol:</strong> {dades.rol}</p>
      </div>

    </div>
  );
}

export default Perfil;
