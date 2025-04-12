import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableRow, Fab } from '@mui/material';
import { useTitol } from '../../context/TitolNavbar';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import LogoutIcon from '@mui/icons-material/Logout';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function Perfil() {
  
  const [dades, setDades] = useState({
    nom: '',
    cognoms: '',
    email: '',
    rol: ''
  });

  const { setTitol } = useTitol();
  const navigate = useNavigate();

  useEffect(() => {
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

  const handleLogout = () => {
    Swal.fire({
        title: 'Tancar sessió?',
        showDenyButton: true,
        confirmButtonText: 'Sí',
        denyButtonText: 'Cancel·la',
        confirmButtonColor: '#dc3545',
        denyButtonColor: '#6c757d',
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.clear();
            navigate('/inicisessio');
        }
    });
  };

  return (
    <div className='page'>
      <TableContainer>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>Nom</TableCell>
              <TableCell>{dades.nom}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>Cognoms</TableCell>
              <TableCell>{dades.cognoms}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>Correu electrònic</TableCell>
              <TableCell>{dades.email}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>Rol</TableCell>
              <TableCell>{dades.rol}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <Fab
        color="error"
        aria-label="logout"
        onClick={handleLogout}
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
      >
        <LogoutIcon />
      </Fab>

    </div>
  );
}

export default Perfil;