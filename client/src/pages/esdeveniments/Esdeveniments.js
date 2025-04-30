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
  
  const [esdevenimentsFuturs, setEsdevenimentsFuturs] = useState([]);
  const [esdevenimentsPassats, setEsdevenimentsPassats] = useState([]);
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

          const esdeveniments = data.esdeveniments;

          let now = new Date();
          now = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes());
          console.log('now', now);

          const parseDate = (dateString) => {
            const [day, month, year] = dateString.split('-');
            return new Date(`${year}-${month}-${day}`);
          };

          const futurs = esdeveniments
            .filter(e => {
              const eventDate = parseDate(e.dia);
              return eventDate >= now;
            })
            .sort((a, b) => parseDate(a.dia) - parseDate(b.dia));

          const passats = esdeveniments
            .filter(e => {
              const eventDate = parseDate(e.dia);
              return eventDate < now;
            })
            .sort((a, b) => parseDate(b.dia) - parseDate(a.dia));

          setEsdevenimentsFuturs(futurs);
          setEsdevenimentsPassats(passats);

        } 
        else {
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

  return (
    <Box>
      <Tabs variant="fullWidth" value={tabIndex} onChange={handleTabChange}>
        <Tab label={ 'Futur' } />
        <Tab label={ 'Passat' } />
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
            {(tabIndex === 0 ? esdevenimentsFuturs : esdevenimentsPassats).map((esdeveniment) => (
              <Grid item xs={12} sm={6} md={4} key={esdeveniment.id}>
                <CardEsdeveniment
                  nom={esdeveniment.nom}
                  dia={esdeveniment.dia}
                  lloc={esdeveniment.lloc}
                  hora_inici={esdeveniment.hora_inici}
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