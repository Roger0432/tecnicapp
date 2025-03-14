import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Box, Fab } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function Membres() {
  const [membres, setMembres] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${BACKEND_URL}/membres`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then(response => response.json())
      .then(data => {
        if (data.status) {
          setMembres(data.membres);
        } else {
          console.error('Error:', data.msg);
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, []);

  const columnes = [
    { field: 'mote', headerName: 'Mote', flex: 0.75 },
    { field: 'alcada_hombro', headerName: 'Alçada hombro', flex: 1 },
  ];

  const handleRowClick = (params) => {
    navigate('/crear-membre', { state: { membre: params.row, editar: true } });
  };

  return (
    <div className='page'>
      
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant='h5' fontWeight={700}>Membres</Typography>
        <Fab size='small' color="primary" aria-label="add" onClick={() => navigate('/crear-membre')}>
          <PersonAddIcon fontSize='small'/>
        </Fab>
      </Box>

      <Box mt={3}>
        <DataGrid
          rows={membres}
          columns={columnes}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 100]}
          disableSelectionOnClick
          onRowClick={handleRowClick}
        />
      </Box>
      
    </div>
  );
}

export default Membres;