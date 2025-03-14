import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/Table.css';
import { Box, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function Esdeveniments({ assaig }) {
  const [esdeveniments, setEsdeveniments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
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
  }, [assaig]);

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
      {
        assaig ? 
          <Typography variant='h5' fontWeight={700} mb={3}>Assaigs</Typography> :
          <Typography variant='h5' fontWeight={700} mb={3}>Diades</Typography>
      }

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
    </div>
  );
}

export default Esdeveniments;