import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../styles/Table.css';
import { Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function Esdeveniments({ assaig }) {
  const [esdeveniments, setEsdeveniments] = useState([]);
  const navigate = useNavigate();

  const detallsEsdeveniment = (id) => {
    if (assaig) {
      navigate(`/assaig/${id}`);
    } else {
      navigate(`/diada/${id}`);
    }
  };

  const borrarEsdeveniment = useCallback((id) => {
    Swal.fire({
      title: 'Estàs segur?',
      text: "No podràs recuperar aquest esdeveniment!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, esborra!',
      cancelButtonText: 'Cancel·la'
    })
    .then((result) => {
      if (result.isConfirmed) {
        fetch(`${BACKEND_URL}/borrar-esdeveniment/${id}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
        })
        .then(response => response.json())
        .then(data => {
          if (data.status) {
            setEsdeveniments(esdeveniments.filter(esdeveniment => esdeveniment.id !== id));
            Swal.fire({
              title: 'Esborrat!',
              icon: 'success',
              timer: 1000,
              showConfirmButton: false
            });
          } else {
            console.error('Failed to delete esdeveniment');
          }
        })
        .catch(error => {
          console.error('Error:', error);
        });
      }
    });
  }, [esdeveniments]);

  const editarEsdeveniment = useCallback((esdeveniment) => {
    if (assaig) {
      navigate('/editar-assaig', { state: { esdeveniment, editar: true } });
    } else {
      navigate('/editar-diada', { state: { esdeveniment, editar: true } });
    }
  }, [assaig, navigate]);

  useEffect(() => {
    fetch(`${BACKEND_URL}/esdeveniments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ assaig }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.status) {
          const esdv = data.esdeveniments.map((esdeveniment) => {
            return {
              id: esdeveniment.id,
              nom: esdeveniment.nom,
              dia: esdeveniment.dia,
              accions: (
                <div>
                  <EditIcon onClick={() => editarEsdeveniment(esdeveniment)} />
                  <DeleteIcon onClick={() => borrarEsdeveniment(esdeveniment.id)} />
                </div>
              ),
            };
          });
          setEsdeveniments(esdv);
        } else {
          console.error('Failed to fetch esdeveniments');
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, [assaig, editarEsdeveniment, borrarEsdeveniment]);

  const columnes = [
    { field: 'nom', headerName: 'Nom', width: 150 },
    { field: 'dia', headerName: 'Dia', width: 100 },,
    { field: 'accions', headerName: 'Accions', width: 100 },
  ];

  return (
    <div className='page'>
      {assaig ? <h1>Assaigs</h1> : <h1>Diades</h1>}

      <Box>
        <DataGrid
          rows={esdeveniments}
          columns={columnes}
          pageSize={5}
          rowsPerPageOptions={[5]}
          //checkboxSelection
          disableSelectionOnClick
          onRowClick={(row) => detallsEsdeveniment(row.row.id)}
        />
      </Box>
    </div>
  );
}

export default Esdeveniments;