import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableRow, Paper } from '@mui/material';
import { useTitol } from '../../context/TitolNavbar';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function Perfil() {
  const [dades, setDades] = useState({
    nom: '',
    cognoms: '',
    email: '',
    rol: ''
  });

  const { setTitol } = useTitol();

  useEffect(() => {
    // Actualitza el títol de la Navbar
    setTitol('Perfil');

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
  }, [setTitol]);

  return (
    <div className='page'>
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell component="th" scope="row">
                <strong>Nom</strong>
              </TableCell>
              <TableCell>{dades.nom}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                <strong>Cognoms</strong>
              </TableCell>
              <TableCell>{dades.cognoms}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                <strong>Correu electrònic</strong>
              </TableCell>
              <TableCell>{dades.email}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                <strong>Rol</strong>
              </TableCell>
              <TableCell>{dades.rol}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default Perfil;