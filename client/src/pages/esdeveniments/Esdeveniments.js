import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/Table.css';
import { Box, Tabs, Tab } from '@mui/material';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import { useTitol } from '../../context/TitolNavbar';
import CardEsdeveniment from './CardEsdeveniment';
import Grid from '@mui/material/Grid';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function Esdeveniments({ assaig }) {
  const [esdeveniments, setEsdeveniments] = useState([]);
  const [tabIndex, setTabIndex] = useState(0);
  const navigate = useNavigate();
  const { setTitol } = useTitol();

  useEffect(() => {
    setTitol(assaig ? 'Assaigs' : 'Diades');

    fetch(`${BACKEND_URL}/esdeveniments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ assaig }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.status) {
          const sortedEsdeveniments = data.esdeveniments.sort((a, b) => new Date(a.dia) - new Date(b.dia));
          setEsdeveniments(sortedEsdeveniments);
        } else {
          console.error('Failed to fetch esdeveniments');
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, [assaig, setTitol]);

  const detallsEsdeveniment = (id) => {
    if (assaig) {
      navigate(`/assaig/${id}`);
    } else {
      navigate(`/diada/${id}`);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const today = new Date();
  const esdevenimentsProxims = esdeveniments.filter(e => new Date(e.dia) >= today);
  const esdevenimentsHistorics = esdeveniments.filter(e => new Date(e.dia) < today);

  return (
    <Box>
      <Tabs variant="fullWidth" value={tabIndex} onChange={handleTabChange}>
        <Tab label={'Futur'} />
        <Tab label={'Passat'} />
      </Tabs>

      <Box sx={{ position: 'relative', height: '100%' }}>
        <Box sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1 }}>
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
          <Grid container spacing={2} sx={{ padding: 2 }}>
            {(tabIndex === 0 ? esdevenimentsProxims : esdevenimentsHistorics).map((esdeveniment) => (
              <Grid item xs={12} sm={6} md={4} key={esdeveniment.id}>
                <CardEsdeveniment
                  nom={esdeveniment.nom}
                  dia={esdeveniment.dia}
                  lloc={esdeveniment.lloc}
                  onClick={() => detallsEsdeveniment(esdeveniment.id)}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}

export default Esdeveniments;