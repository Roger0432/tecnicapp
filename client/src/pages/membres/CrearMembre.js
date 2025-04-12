import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Box, Button, TextField, Typography, SpeedDial, SpeedDialAction, SpeedDialIcon } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import Tooltip from '@mui/material/Tooltip';
import Fab from '@mui/material/Fab';
import TaulaDetallsMembre from '../../components/DetallsMembres';
import { useTitol } from '../../context/TitolNavbar';


const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function CrearMembre() {
  const navigate = useNavigate();
  const location = useLocation();
  const { membre = {}, editar = false } = location.state || {};

  const [modeEdicio, setModeEdicio] = useState(false);
  const [mote, setMote] = useState(membre.mote || '');
  const [nom, setNom] = useState(membre.nom || '');
  const [cognoms, setCognoms] = useState(membre.cognoms || '');
  const [alcadaHombro, setAlcadaHombro] = useState(membre.alcada_hombro || '');
  const [alcadaMans, setAlcadaMans] = useState(membre.alcada_mans || '');
  const [comentaris, setComentaris] = useState(membre.comentaris || '');
  const [error, setError] = useState('');
  const { setTitol } = useTitol();

  useEffect(() => {
    const titol = editar ? (modeEdicio ? 'Editar Membre' : 'Detalls') : 'Crear Membre';
    setTitol(titol);
  }, [editar, modeEdicio, setTitol]);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (mote === '' || nom === '') {
      setError("Has d'omplir els camps nom i mote");
      return;
    }

    const data = {
      mote,
      nom,
      cognoms,
      alcada_hombro: alcadaHombro ? parseFloat(alcadaHombro) : 0,
      alcada_mans: alcadaMans ? parseFloat(alcadaMans) : 0,
      comentaris,
    };

    let url = `${BACKEND_URL}`;
    if (editar) url += `/editar-membre/${membre.id}`;
    else url += '/crear-membre';

    const method = editar ? 'PUT' : 'POST';

    fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status) {
          Swal.fire({
            title: editar ? 'Membre actualitzat' : 'Membre creat',
            icon: 'success',
            showConfirmButton: false,
            timer: 1000,
          }).then(() => navigate('/membres'));
        } else {
          console.error('Error:', data.msg);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const borrarMembre = () => {
    Swal.fire({
      title: 'Estàs segur?',
      text: 'Aquesta acció no es pot desfer!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar!',
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`${BACKEND_URL}/borrar-membre/${membre.id}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.status) {
              Swal.fire({
                title: 'Membre eliminat',
                icon: 'success',
                showConfirmButton: false,
                timer: 1000,
              }).then(() => navigate('/membres'));
            } else {
              console.error('Error:', data.msg);
            }
          })
          .catch((error) => {
            console.error('Error:', error);
          });
      }
    });
  };

  return (
    <Box className='page' display="flex" justifyContent="center">
      {!modeEdicio && editar && (
        <Box display="flex" alignItems="center" sx={{ position: 'fixed', bottom: 24, right: 24 }}>
          <SpeedDial
            ariaLabel="SpeedDial basic example"
            icon={<SpeedDialIcon />}
            direction="up"
          >
            <SpeedDialAction
              icon={<EditIcon />}
              tooltipTitle="Editar"
              onClick={() => setModeEdicio(true)}
            />
            <SpeedDialAction
              icon={<DeleteIcon />}
              tooltipTitle="Eliminar"
              onClick={borrarMembre}
            />
          </SpeedDial>
        </Box>
      )}

      {!modeEdicio && editar ? (
        <TaulaDetallsMembre membre={{ mote, nom, cognoms, alcada_hombro: alcadaHombro, alcada_mans: alcadaMans, comentaris }} />
      ) : (
        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', maxWidth: '400px' }}>
          <Box className="form-group" display="flex" flexDirection="column">
            <Box mb={2}>
              <TextField
                fullWidth
                label="Mote"
                value={mote}
                onChange={(e) => setMote(e.target.value)}
                variant="outlined"
                autoComplete="nickname"
              />
            </Box>

            <Box mb={2}>
              <TextField
                fullWidth
                label="Nom"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                variant="outlined"
                autoComplete="given-name"
              />
            </Box>

            <Box mb={2}>
              <TextField
                fullWidth
                label="Cognoms"
                value={cognoms}
                onChange={(e) => setCognoms(e.target.value)}
                variant="outlined"
                autoComplete="family-name"
              />
            </Box>

            <Box mb={2}>
              <TextField
                fullWidth
                label="Alçada de l'hombro (cm)"
                value={alcadaHombro}
                onChange={(e) => setAlcadaHombro(e.target.value)}
                variant="outlined"
                type="number"
              />
            </Box>

            <Box mb={2}>
              <TextField
                fullWidth
                label="Alçada de les mans (cm)"
                value={alcadaMans}
                onChange={(e) => setAlcadaMans(e.target.value)}
                variant="outlined"
                type="number"
              />
            </Box>

            <Box mb={2}>
              <TextField
                fullWidth
                label="Comentaris"
                value={comentaris}
                onChange={(e) => setComentaris(e.target.value)}
                variant="outlined"
                multiline
                rows={4}
              />
            </Box>
          </Box>

          {modeEdicio && (
            <Box
              sx={{
                position: 'fixed',
                bottom: 24,
                right: 24,
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <Tooltip title="Guardar" placement="top">
                <Fab 
                  color="primary" 
                  aria-label="guardar"
                  onClick={handleSubmit}
                  sx={{
                    boxShadow: 3
                  }}
                >
                  <SaveIcon />
                </Fab>
              </Tooltip>
            </Box>
          )}

          {!editar && (
            <Button type="submit" variant="contained" color="primary" fullWidth>Crear</Button>
          )}
          {error && <Typography color="error" mt={2}>{error}</Typography>}
        </Box>
      )}
    </Box>
  );
}

export default CrearMembre;