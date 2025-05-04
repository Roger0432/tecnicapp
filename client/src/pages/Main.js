import React, { useEffect, useState } from 'react';
import '../styles/Tronc.css';
import { Link } from 'react-router-dom';
import { Button, Box, Typography } from '@mui/material';
import { useTitol } from '../context/TitolNavbar';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function Main() {
  const { setTitol } = useTitol();
  const [userData, setUserData] = useState('');

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
  }, [setTitol]);
        

  return (
    <Box m={2} mt={4}>

        <Typography component="h1" variant="h6" mb={3} align="center">
          Benvingut, {(userData.nom)}!
        </Typography>

        <Box display='flex' justifyContent='center'>
          <Box className="form-group" display="flex" flexDirection="column" gap={2} style={{ width: '100%', maxWidth: '400px' }}>
            <Button variant="contained" component={Link} to="/crear-assaig">Crear assaig</Button>
            <Button variant="contained" component={Link} to="/crear-diada">Crear diada</Button>
          </Box>
          
          {/* 
          <h1>CALENDARI</h1>
          <iframe 
            src="https://calendar.google.com/calendar/embed?src=5e80ea51ac6c553da920f7c80d620cc582da641da13b6d16c54225f674348d25%40group.calendar.google.com&ctz=Europe%2FMadrid" 
            title="Calendari Passerells"
            style={{ border: 0 }} 
            width="800" 
            height="600" 
          ></iframe>
          */}
        </Box>        
        

    </Box>
  );
}

export default Main;