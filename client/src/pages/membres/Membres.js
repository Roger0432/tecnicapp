import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Fab, TextField, InputAdornment } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SearchIcon from '@mui/icons-material/Search';
import { useTitol } from '../../context/TitolNavbar';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

// Funció per normalitzar text (eliminar accents i convertir a minúscules)
const normalitzarText = (text) => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
};

function Membres() {
  const [membres, setMembres] = useState([]);
  const [membresFiltrats, setMembresFiltrats] = useState([]);
  const [cercaText, setCercaText] = useState('');
  const navigate = useNavigate();
  const { setTitol } = useTitol();

  useEffect(() => {
    setTitol('Membres');

    fetch(`${BACKEND_URL}/membres`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then(response => response.json())
      .then(data => {
        if (data.status) {
          const membresAmbNomComplet = data.membres.map(membre => ({
            ...membre,
            nomComplet: `${membre.nom} ${membre.cognoms}`,
          }));
          // Ordenar membres alfabèticament per nom i cognoms
          const membresOrdenats = membresAmbNomComplet.sort((a, b) => 
            a.nomComplet.localeCompare(b.nomComplet)
          );
          setMembres(membresOrdenats);
          setMembresFiltrats(membresOrdenats);
        } else {
          console.error('Error:', data.msg);
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, [setTitol]);

  useEffect(() => {
    if (cercaText.trim() === '') {
      setMembresFiltrats(membres);
    } else {
      const textNormalitzat = normalitzarText(cercaText);
      
      const filtrats = membres.filter(membre => {
        // Normalitzar nom complet i mote per a la comparació
        const nomNormalitzat = normalitzarText(membre.nomComplet);
        const moteNormalitzat = membre.mote ? normalitzarText(membre.mote) : '';
        
        return nomNormalitzat.includes(textNormalitzat) || 
               moteNormalitzat.includes(textNormalitzat);
      });
      
      setMembresFiltrats(filtrats);
    }
  }, [cercaText, membres]);

  const handleCercaChange = (event) => {
    setCercaText(event.target.value);
  };

  const columnes = [
    { field: 'mote', headerName: 'Mote', flex: 0.6 },
    { field: 'nomComplet', headerName: 'Nom', flex: 1 },
  ];

  const handleRowClick = (params) => {
    navigate('/crear-membre', { state: { membre: params.row, editar: true } });
  };

  return (
    <Box m={2}>
      <Box sx={{ position: 'relative', height: '100%' }}>
        <Box mb={2}>
          <TextField
            fullWidth
            variant="standard"
            placeholder="Cerca un membre"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            value={cercaText}
            onChange={handleCercaChange}
          />
        </Box>
        <Box>
          <DataGrid
            rows={membresFiltrats}
            columns={columnes}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 100]}
            disableSelectionOnClick
            onRowClick={handleRowClick}
            sx={{ marginTop: 4 }}
          />
        </Box>

        <Box sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1 }}>
          <Fab
            color="primary"
            aria-label="add"
            onClick={() => navigate('/crear-membre')}
          >
            <PersonAddIcon />
          </Fab>
        </Box>
      </Box>
    </Box>
  );
}

export default Membres;