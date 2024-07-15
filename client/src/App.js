import React/*, { useEffect }*/ from 'react';
import { Routes, Route, /*useNavigate, useLocation */} from 'react-router-dom';
import IniciSessio from './pages/IniciSessio';
import Registre from './pages/Registre';
import Navbar from './components/Navbar';
import Main from './pages/Main';
import Assaigs from './pages/Assaigs';
import Diades from './pages/Diades';
import Membres from './pages/Membres';
import Perfil from './pages/Perfil';
import Configuracio from './pages/Configuracio';
import CrearAssaig from './pages/CrearAssaig';

//const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function App() {

  /*
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem('authtoken');
  
      if (!token) {
        navigate('/inicisessio');
      } else {
        fetch(`${BACKEND_URL}/verify-token`, {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` },
        })
        .then(response => response.json())
        .then(data => {
          if (data.status) {
            navigate('/main');
          } else {
            localStorage.clear();
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
  }, [navigate, location.pathname]);
  */

  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/inicisessio" element={<IniciSessio />} />
        <Route path="/registre" element={<Registre />} />

        <Route path="/" element={<Main />} />
        <Route path="/main" element={<Main />} />
        <Route path="/assaigs" element={<Assaigs />} />
        <Route path="/diades" element={<Diades />} />
        <Route path="/membres" element={<Membres />} />

        <Route path="/perfil" element={<Perfil />} />
        <Route path="/configuracio" element={<Configuracio />} />

        <Route path="/crear-assaig" element={<CrearAssaig />} />
      </Routes>
    </div>
  );
}

export default App;
