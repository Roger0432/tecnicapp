import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/Table.css';
import { Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import { useTitol } from '../../context/TitolNavbar';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function Esdeveniments({ assaig }) {
  const [esdeveniments, setEsdeveniments] = useState([]);
  const navigate = useNavigate();
  const { setTitol } = useTitol(); // Obté la funció per actualitzar el títol

  useEffect(() => {
    // Actualitza el títol segons si és un assaig o una diada
    setTitol(assaig ? 'Assaigs' : 'Diades');

    fetch(`${BACKEND_URL}/esdeveniments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ assaig }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.status) {
          setEsdeveniments(data.esdeveniments);
        } else {
          console.error('Failed to fetch esdeveniments');
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, [assaig, setTitol]); // Afegeix `setTitol` com a dependència

  const detallsEsdeveniment = (id) => {
    if (assaig) {
      navigate(`/assaig/${id}`);
    } else {
      navigate(`/diada/${id}`);
    }
  };

  const columnes = [
    { field: 'nom', headerName: 'Nom', flex: 1 },
    { field: 'dia', headerName: 'Dia', flex: 1 },
  ];

  return (
    <div className='page'>

      <Box sx={{ position: 'relative', height: '100%' }}>
        
        <Box sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1  }}>
          {assaig ? (
            <Fab color="primary" onClick={() => navigate('/crear-assaig')}>
              <AddIcon />
            </Fab>
          ) : (
            <Fab color="primary" onClick={() => navigate('/crear-diada')}>
              <AddIcon />
            </Fab>
          )}
        </Box>

        <Box>
          <DataGrid
            rows={esdeveniments}
            columns={columnes}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 100]}
            disableSelectionOnClick
            onRowClick={(row) => detallsEsdeveniment(row.row.id)}
          />
        </Box>
        
      </Box>
    </div>
  );
}

export default Esdeveniments;