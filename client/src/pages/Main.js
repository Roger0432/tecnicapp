import React, { useEffect } from 'react';
import '../styles/App.css';
import '../styles/Tronc.css';
import { Link } from 'react-router-dom';
import { Button, Box } from '@mui/material';
import { useTitol } from '../context/TitolNavbar';

function Main() {
  const { setTitol } = useTitol();

  useEffect(() => {
    setTitol('Menú');
  }, [setTitol]);

  return (
    <div className='page' style={{ display: 'flex', justifyContent: 'center' }}>
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
    </div>
  );
}

export default Main;