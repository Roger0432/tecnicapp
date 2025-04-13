import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography, Select, MenuItem, FormControl, InputLabel, List, ListItem, ListItemText, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTitol } from '../../context/TitolNavbar';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function AfegirCastell({ assaig }) {
  const [castells, setCastells] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCastells, setFilteredCastells] = useState([]);
  const [selectedCastells, setSelectedCastells] = useState([]);
  const [selectedCastellId, setSelectedCastellId] = useState('');
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
          if (data.castells.length > 0) {
            setSelectedCastellId(data.castells[0].id.toString());
          }
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
    if (filtered.length > 0) {
      setSelectedCastellId(filtered[0].id.toString());
    } else {
      setSelectedCastellId('');
    }
  };

  const handleSelectChange = (e) => {
    setSelectedCastellId(e.target.value);
  };

  const afegirCastell = () => {
    const selectedCastell = castells.find(castell => castell.id === parseInt(selectedCastellId));
    if (selectedCastell && !selectedCastells.includes(selectedCastell)) {
      setSelectedCastells([...selectedCastells, selectedCastell]);
    }
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
    <Box className="page"> 
      <Typography variant="body1" mb={1}>
        {assaig ? 'Selecciona les proves que vols afegir' : 'Selecciona els castells que vols afegir'}
      </Typography>

      <TextField
        label="Cerca"
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Cerca..."
        fullWidth
        margin="normal"
      />

      <FormControl fullWidth margin="normal">
        <InputLabel>Castell</InputLabel>
        <Select
          value={selectedCastellId}
          onChange={handleSelectChange}
          label="Castell"
          MenuProps={{
            PaperProps: {
              style: {
                maxHeight: 400,
                overflow: 'auto',
              },
            },
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'left',
            },
            transformOrigin: {
              vertical: 'top',
              horizontal: 'left',
            },
          }}
        >
          {filteredCastells.map((castell) => (
            <MenuItem key={castell.id} value={castell.id}>
              {castell.nom}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button variant="contained" onClick={afegirCastell} sx={{ mt: 2 }}>
        Afegir
      </Button>

      <List> 
        {selectedCastells.map((castell) => (  
          <ListItem
            key={castell.id}
            secondaryAction={
              <IconButton edge="end" aria-label="delete" onClick={() => esborrarCastell(castell.id)}>
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemText primary={castell.nom} />
          </ListItem>
        ))}
      </List>

      <Button variant="contained" onClick={guardarCanvis}>
        Guardar canvis
      </Button>
    </Box>
  );
}

export default AfegirCastell;