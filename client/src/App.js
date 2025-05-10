import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import IniciSessio from './pages/autenticacio/IniciSessio';
import Registre from './pages/autenticacio/Registre';

import Esdeveniments from './pages/esdeveniments/Esdeveniments';
import CrearEsdeveniment from './pages/esdeveniments/CrearEsdeveniment';
import DetallsEsdeveniment from './pages/esdeveniments/DetallsEsdeveniment';

import EditarCastell from './pages/castells/EditarCastell';
import AfegirCastell from './pages/castells/AfegirCastell';

import CrearMembre from './pages/membres/CrearMembre';
import Membres from './pages/membres/Membres';

import CustomNavbar from './pages/altres/CustomNavbar';
import Main from './pages/altres/Main';
import Perfil from './pages/altres/Perfil';


const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('authtoken');
    const currentPath = window.location.pathname;
    const publicRoutes = ['/inicisessio', '/registre'];

    if (publicRoutes.includes(currentPath)) {
      return;
    }

    if (!token) {
      navigate('/inicisessio');
      return;
    }

    fetch(`${BACKEND_URL}/verify-token`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => response.json())
      .then(data => {
        if (data.status) {
          setIsAuthenticated(true);
        } else {
          navigate('/inicisessio');
          localStorage.clear();
        }
      })
      .catch(error => {
        console.error('Error:', error);
        navigate('/inicisessio');
        localStorage.clear();
      });
  }, [navigate]);

  return (
    <div className="App">
      {!['/inicisessio', '/registre'].includes(location.pathname) && isAuthenticated && <CustomNavbar />}
        <Routes>
          <Route path="/inicisessio" element={<IniciSessio />} />
          <Route path="/registre" element={<Registre />} />

          <Route path="/" element={<Main />} />
          <Route path="/main" element={<Main />} />
          <Route path="/perfil" element={<Perfil />} />

          <Route path="/membres" element={<Membres />} />
          <Route path="/crear-membre" element={<CrearMembre />} />
          <Route path="/editar-membre" element={<CrearMembre />} />

          <Route path="/assaigs" element={<Esdeveniments assaig={true} />} />
          <Route path="/diades" element={<Esdeveniments assaig={false} />} />

          <Route path="/crear-assaig" element={<CrearEsdeveniment assaig={true} />} /> 
          <Route path="/crear-diada" element={<CrearEsdeveniment assaig={false} />} />
          
          <Route path="/editar-assaig/:id" element={<CrearEsdeveniment assaig={true} />} />
          <Route path="/editar-diada/:id" element={<CrearEsdeveniment assaig={false} />} />
          
          <Route path="/assaig/:id" element={<DetallsEsdeveniment assaig={true} />} />
          <Route path="/diada/:id" element={<DetallsEsdeveniment assaig={false} />} />

          <Route path="prova/:id" element={<EditarCastell assaig={true} />} />
          <Route path="castell/:id" element={<EditarCastell assaig={false} />} />

          <Route path="/nova-prova/:id" element={<AfegirCastell assaig={true} />} />
          <Route path="/nou-castell/:id" element={<AfegirCastell assaig={false} />} />
        </Routes>
    </div>
  );
}

export default App;
