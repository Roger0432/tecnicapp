import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography, IconButton, Card, Grid } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Autocomplete } from '@mui/material';
import { useTitol } from '../../context/TitolNavbar';


const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function AfegirCastell({ assaig }) {
  const [castells, setCastells] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCastells, setFilteredCastells] = useState([]);
  const [selectedCastells, setSelectedCastells] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const { setTitol } = useTitol();

  useEffect(() => {
    setTitol(assaig ? 'Afegir proves' : 'Afegir castells');
  }, [assaig, setTitol]);

  useEffect(() => {
    fetch(`${BACKEND_URL}/castells`)
      .then(response => response.json())
      .then(data => {
        if (data.status) {
          setCastells(data.castells);
          setFilteredCastells(data.castells);
        } else {
          console.error(data.msg);
        }
      })
      .catch(error => console.error('Error:', error));
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    const filtered = castells.filter(castell =>
      castell.nom.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredCastells(filtered);
  };

  const esborrarCastell = (id) => {
    setSelectedCastells(selectedCastells.filter(castell => castell.id !== id));
  };

  const guardarCanvis = () => {
    fetch(`${BACKEND_URL}/guardar-castells`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ castells: selectedCastells, esdeveniment_id: id }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.status) {
          navigate(assaig ? `/assaig/${id}` : `/diada/${id}`);
        } else {
          console.error(data.msg);
        }
      })
      .catch(error => console.error('Error:', error));
  };

  return (
    <Box className='page' display="flex" justifyContent="center">
      <Box sx={{ width: '100%', maxWidth: '400px' }} display="flex" flexDirection="column">
        <Typography variant="body1" mb={1}>
          {assaig ? 'Selecciona les proves que vols afegir' : 'Selecciona els castells que vols afegir'}
        </Typography>

        <Autocomplete
          options={filteredCastells}
          getOptionLabel={(option) => option.nom}
          value={null}
          onChange={(event, newValue) => {
            if (newValue) {
              const selectedCastell = castells.find(castell => castell.id === newValue.id);
              if (selectedCastell && !selectedCastells.includes(selectedCastell)) {
                setSelectedCastells([...selectedCastells, selectedCastell]);
              }
            }
            setSearchTerm('');
            setFilteredCastells(castells);
          }}
          inputValue={searchTerm}
          onInputChange={(event, newInputValue) => handleSearchChange({ target: { value: newInputValue } })}
          renderInput={(params) => (
            <TextField {...params} label="Cerca castells" placeholder="Cerca..." fullWidth margin="normal" />
          )}
        />

        <Box sx={{ mt: 2, mb: 2 }}>
          <Grid container spacing={2}>
            {selectedCastells.map((castell) => (
              <Grid item xs={12} key={castell.id}>
                <Card variant="outlined">
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 16px' }}>
                    <Typography variant="body1" component="div">
                      {castell.nom}
                    </Typography>
                    <IconButton 
                      size="small" 
                      onClick={() => esborrarCastell(castell.id)}
                      aria-label="esborrar castell"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Button variant="contained" onClick={guardarCanvis} sx={{ mt: 2 }}>
          {assaig ? 'Afegir proves' : 'Afegir castells'}
        </Button>
      </Box>
    </Box>
  );
}

export default AfegirCastell;