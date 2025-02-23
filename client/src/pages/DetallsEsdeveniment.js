import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { Box, Typography, Button, IconButton, Table, TableBody, TableCell, TableRow } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PlaceIcon from '@mui/icons-material/Place';
import Swal from 'sweetalert2';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function DetallsEsdeveniment() {
  const [detalls, setDetalls] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    fetch(`${BACKEND_URL}/esdeveniment/${id}`)
      .then(response => response.json())
      .then(data => {
        if (data.status) {
          setDetalls(data.esdeveniment);
        } else {
          console.error(data.msg);
        }
      })
      .catch(error => console.error('Error:', error));
  }, [id]);

  const borrarCastell = (id) => {
    Swal.fire({
      title: 'Estàs segur?',
      text: `No podràs recuperar ${detalls.assaig ? 'aquesta prova!' : 'aquest castell!'}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, esborra!',
      cancelButtonText: 'Cancel·la'
    })
    .then((result) => {
      if (result.isConfirmed) {
        fetch(`${BACKEND_URL}/borrar-castell/${id}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
        })
        .then(response => response.json())
        .then(data => {
          if (data.status) {
            Swal.fire({
              title: 'Esborrat!',
              icon: 'success',
              timer: 1000,
              showConfirmButton: false
            })
            .then(() => window.location.reload());
          } else {
            console.error('Failed to delete castell');
          }
        })
        .catch(error => {
          console.error('Error:', error);
        });
      }
    });
  };

  if (!detalls) {
    return <Typography variant="h6">Carregant...</Typography>;
  }

  return (
    <Box className="page">
      <Typography variant="h4" mb={2} sx={{ fontWeight: 'bold' }}>{detalls.nom}</Typography>

        <Box className="detalls" mb={2}>
          <Box display="flex" alignItems="center" mb={1} color="gray">
            <EventIcon />
            <Typography variant="body1" ml={1} color="gray">{detalls.dia}</Typography>
          </Box>
        
          <Box display="flex" alignItems="center" mb={1} color="gray">
            <AccessTimeIcon />
            <Typography variant="body1" ml={1} color="gray">{detalls.hora_inici} - {detalls.hora_fi}</Typography>
          </Box>

          <Box display="flex" alignItems="center" mb={1} color="gray">
            <PlaceIcon />
            <Typography variant="body1" ml={1} color="gray">{detalls.lloc}</Typography>
          </Box>
        </Box>

      {detalls.assaig ? (
        <>
          <Typography variant="h5" mb={2} sx={{ fontWeight: 'bold' }}>Proves</Typography>
          <Button component={RouterLink} to={`/nova-prova/${id}`} variant="contained" sx={{ mb: 2 }}>
            Afegir prova
          </Button>

          {detalls.castells[0] !== null ? (
            detalls.castells.map((prova, index) => (
              <Box key={index} className='prova' display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                <Button component={RouterLink} to={`/prova/${detalls.id[index]}`} variant="text">
                  {prova}
                </Button>
                <IconButton edge="end" aria-label="delete" onClick={() => borrarCastell(detalls.id[index])}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))
          ) : null}
        </>
      ) : (
        <>
          <Typography variant="h5" mb={2} sx={{ fontWeight: 'bold' }}>Castells</Typography>
          <Button component={RouterLink} to={`/nou-castell/${id}`} variant="contained" sx={{ mb: 2 }}>
            Afegir castell
          </Button>

          {detalls.castells[0] !== null ? (
            <Table>
              <TableBody>
                {detalls.castells.map((castell, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Typography variant="body1">{castell}</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton edge="end" aria-label="delete" onClick={() => borrarCastell(detalls.id[index])}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : null}
        </>
      )}
    </Box>
  );
}

export default DetallsEsdeveniment;