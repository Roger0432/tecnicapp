import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { TextField, Button, Box, Select, MenuItem, FormControl, InputLabel, Alert, Collapse, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Swal from 'sweetalert2';
import '../../styles/App.css';
import { useTitol } from '../../context/TitolNavbar';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function CrearEsdeveniment({ assaig }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { esdeveniment = {}, editar = false } = location.state || {};
  const { setTitol } = useTitol();

  useEffect(() => {
    if (editar) {
      setTitol(assaig ? 'Editar Assaig' : 'Editar Diada');
    } else {
      setTitol(assaig ? 'Crear Assaig' : 'Crear Diada');
    }
  }, [assaig, editar, setTitol]);

  const formatDate = (date) => {
    if (!date) return '';
    const dateParts = date.split('-');
    return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
  };

  const [nom, setNom] = useState(esdeveniment.nom || (assaig ? 'Assaig general' : ''));
  const [dia, setDia] = useState(formatDate(esdeveniment.dia) || '');
  const [lloc, setLloc] = useState(esdeveniment.lloc || (assaig ? '0' : ''));
  const [hora, setHora] = useState(esdeveniment.hora_inici || '');
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setOpen(false);

    if (dia === '' || lloc === '0' || hora === '' || nom === '') {
      setError("Has d'omplir tots els camps");
      setOpen(true);
      return;
    }

    const data = { dia, lloc, hora, assaig: assaig, nom };

    let url = `${BACKEND_URL}`;
    if (editar) url += `/editar-esdeveniment/${id}`;
    else url += '/crear-esdeveniment';

    const method = editar ? 'PUT' : 'POST';

    fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(data => {
        if (data.status) {
          const title = assaig ? 'Assaig guardat correctament' : 'Diada guardada correctament';
          Swal.fire({
            icon: 'success',
            title: title,
            showConfirmButton: false,
            timer: 1000
          })
            .then(() => {
              if (assaig) {
                navigate('/assaigs');
              } else {
                navigate('/diades');
              }
            });
        } else {
          setError(data.msg);
          setOpen(true);
        }
      })
      .catch(error => {
        console.error('Error:', error);
        setError('Error del servidor');
        setOpen(true);
      });
  };

  return (
    <Box className='page' display="flex" justifyContent="center">
      <Box component="form" onSubmit={handleSubmit} maxWidth={400} width="100%">
        <Box className="form-group" display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Nom"
            type="text"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            placeholder={assaig ? "Nom de l'assaig" : "Nom de la diada"}
            fullWidth
          />
          <TextField
            label="Dia"
            type="date"
            value={dia}
            onChange={(e) => setDia(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
          {assaig ? (
            <FormControl fullWidth>
              <InputLabel>Lloc</InputLabel>
              <Select
                value={lloc}
                onChange={(e) => setLloc(e.target.value)}
                label="Lloc"
              >
                <MenuItem value="0" disabled>
                  Selecciona un lloc
                </MenuItem>
                <MenuItem value="Plaça del TecnoCampus">Plaça del TecnoCampus</MenuItem>
                <MenuItem value="Local de Capgrossos">Local de Capgrossos</MenuItem>
              </Select>
            </FormControl>
          ) : (
            <TextField
              label="Lloc"
              type="text"
              value={lloc}
              onChange={(e) => setLloc(e.target.value)}
              placeholder="Lloc de la diada"
              fullWidth
            />
          )}
          <TextField
            label="Hora"
            type="time"
            value={hora}
            onChange={(e) => setHora(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
          <Button variant="contained" type="submit" color="primary" fullWidth>
            {editar ? 'Editar' : 'Crear'}
          </Button>
        </Box>

        <Box sx={{ width: '100%', mt: 2 }}>
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
  );
}

export default CrearEsdeveniment;