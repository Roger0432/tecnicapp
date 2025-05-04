import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Fab } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useTitol } from '../../context/TitolNavbar';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function Membres() {
  const [membres, setMembres] = useState([]);
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
        } else {
          console.error('Error:', data.msg);
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, [setTitol]);

  const columnes = [
    { field: 'mote', headerName: 'Mote', flex: 0.6 },
    { field: 'nomComplet', headerName: 'Nom', flex: 1 },
  ];

  const handleRowClick = (params) => {
    navigate('/crear-membre', { state: { membre: params.row, editar: true } });
  };

  return (
    <Box m={4}>
      <Box sx={{ position: 'relative', height: '100%' }}>
        <Box>
          <DataGrid
            rows={membres}
            columns={columnes}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 100]}
            disableSelectionOnClick
            onRowClick={handleRowClick}
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