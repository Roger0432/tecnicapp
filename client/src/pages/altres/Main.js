import React, { useEffect, useState } from 'react';
import '../../styles/Tronc.css';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, Divider } from '@mui/material';
import { useTitol } from '../../context/TitolNavbar';
import CircularProgress from '@mui/material/CircularProgress';
import EventIcon from "@mui/icons-material/Event";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PlaceIcon from "@mui/icons-material/Place";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const cardStyle = {
  border: '2px solid #ccc',
  transition: 'all 0.2s ease',
  '&:hover': {
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    background: '#f9f9f9',
    cursor: 'pointer',
  }
};

function Main() {
  const { setTitol } = useTitol();
  const [userData, setUserData] = useState('');
  const [proximAssaig, setProximAssaig] = useState('');
  const [proximaDiada, setProximaDiada] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setTitol('Menú');

    const email = localStorage.getItem('email');

    fetch(`${BACKEND_URL}/user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email })
    })
    .then(response => response.json())
    .then(data => {
      if (data.status) {
        setUserData(data.dades);
      } else {
        console.error(data.msg);
      }
    })
    .catch(error => {
      console.error('Error fetching user data:', error);
    });

    fetch(`${BACKEND_URL}/proxims-esdeveniments`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(response => response.json())
    .then(data => {
      if (data.status) {
        setProximAssaig(data.proximAssaig);
        setProximaDiada(data.proximaDiada);
        setLoading(false);
      } 
      else {
        console.error(data.msg);
      }
    })
    .catch(error => {
      console.error('Error fetching events:', error);
    });

  }, [setTitol]);

  const handleCardClick = (id, assaig) => {  
    if (assaig) {
      navigate(`/assaig/${id}`);
    }
    else {
      navigate(`/diada/${id}`);
    }
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }
        

  return (
    <Box m={2} mt={4}>

        <Typography component="h1" variant="h6" mb={3} align="center">
          Benvingut {(userData.nom)}!
        </Typography>

        <Grid container spacing={2} mb={3}>
          <Grid item xs={12} sm={6}>
            <Card 
              variant="outlined" 
              sx={cardStyle} 
              onClick={() => proximAssaig && handleCardClick(proximAssaig.id, true)}
            >
              <CardContent>
                <Typography variant="body1" fontWeight="bold" gutterBottom align="center">
                  Pròxim assaig
                </Typography>
                <Divider sx={{ mb: 1 }} />
                <Typography variant="h6" align="center">
                  {proximAssaig ? proximAssaig.nom : 'No hi ha assaigs programats'}
                </Typography>
                <Typography variant="body1" align="center">
                  {proximAssaig ? proximAssaig.data : ''}
                </Typography>
                <Box display="flex" alignItems="center" justifyContent="center" mt={1}>
                  <EventIcon fontSize="small" style={{ marginRight: 5 }} />
                  <Typography variant="body2">
                    {proximAssaig ? proximAssaig.dia : ''}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" justifyContent="center" mt={1}>
                  <AccessTimeIcon fontSize="small" style={{ marginRight: 5 }} />
                  <Typography variant="body2">
                    {proximAssaig ? proximAssaig.hora_inici+' - '+proximAssaig.hora_fi : ''}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" justifyContent="center" mt={1}>
                  <PlaceIcon fontSize="small" style={{ marginRight: 5 }} />
                  <Typography variant="body2">
                    {proximAssaig ? proximAssaig.lloc : ''}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Card 
              variant="outlined" 
              sx={cardStyle} 
              onClick={() => proximaDiada && handleCardClick(proximaDiada.id, false)}
            >
              <CardContent>
                <Typography variant="body1" fontWeight="bold" gutterBottom align="center">
                  Pròxima diada
                </Typography>
                <Divider sx={{ mb: 1 }} />
                <Typography variant="h6" align="center">
                  {proximaDiada ? proximaDiada.nom : 'No hi ha diades programades'}
                </Typography>
                <Typography variant="body1" align="center">
                  {proximaDiada ? proximaDiada.data : ''}
                </Typography>
                <Box display="flex" alignItems="center" justifyContent="center" mt={1}>
                  <EventIcon fontSize="small" style={{ marginRight: 5 }} />
                  <Typography variant="body2">
                    {proximaDiada ? proximaDiada.dia : ''}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" justifyContent="center" mt={1}>
                  <AccessTimeIcon fontSize="small" style={{ marginRight: 5 }} />
                  <Typography variant="body2">
                    {proximaDiada ? proximaDiada.hora_inici+' - '+proximaDiada.hora_fi : ''}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" justifyContent="center" mt={1}>
                  <PlaceIcon fontSize="small" style={{ marginRight: 5 }} />
                  <Typography variant="body2">
                    {proximaDiada ? proximaDiada.lloc : ''}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        
    </Box>
  );
}

export default Main;