import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import IniciSessio from './pages/IniciSessio';
import Registre from './pages/Registre';
import Main from './pages/Main';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function App() {

  const navigate = useNavigate();

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem('authtoken');
      if (!token) {
        console.log('No token found');
        navigate('/inicisessio');
      } 
      else {
        fetch(`${BACKEND_URL}/verify-token`, {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` },
        })
        .then(response => response.json())
        .then(data => {
          if (data.status) {
            navigate('/main');
          } 
          else {
            localStorage.clear();
            console.log('Error verifying token:', data.msg);
            navigate('/inicisessio');
          }
        })
        .catch(error => {
          console.error('Error verifying token:', error);
          localStorage.clear();
          navigate('/inicisessio');
        });
      }
    };
    checkToken();
  }, [navigate]);
  
  

  return (
    <div className="App">

      <h1>TECNICAPP</h1>

      <Routes>
        <Route path="/inicisessio" element={<IniciSessio />} />
        <Route path="/registre" element={<Registre />} />
        <Route path="/" element={<Main />} />
        <Route path="/main" element={<Main />} />
      </Routes>

    </div>
  );
}

export default App;