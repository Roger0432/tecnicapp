import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableRow, Fab, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import { useTitol } from '../../context/TitolNavbar';
import { useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function Perfil() {
  
  const [dades, setDades] = useState({
    nom: '',
    cognoms: '',
    email: '',
    rol: ''
  });

  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);

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
    setOpenLogoutDialog(true);
  };

  const confirmLogout = () => {
    localStorage.clear();
    navigate('/inicisessio');
    setOpenLogoutDialog(false);
  };

  const cancelLogout = () => {
    setOpenLogoutDialog(false);
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

      <Dialog
        open={openLogoutDialog}
        onClose={cancelLogout}
        aria-labelledby="logout-dialog-title"
        aria-describedby="logout-dialog-description"
      >
        <DialogTitle id="logout-dialog-title">Tancar sessió?</DialogTitle>
        <DialogContent>
          <DialogContentText id="logout-dialog-description">
            Estàs segur que vols tancar la sessió?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelLogout} color="primary">
            Cancel·la
          </Button>
          <Button onClick={confirmLogout} color="primary" autoFocus>
            Sí
          </Button>
        </DialogActions>
      </Dialog>

    </div>
  );
}

export default Perfil;