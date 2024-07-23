import React from 'react';
import { Routes, Route, } from 'react-router-dom';
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
import DetallsAssaig from './pages/DetallsAssaig';
import CrearDiada from './pages/CrearDiada';
import DetallsDiada from './pages/DetallsDiada';
import PlantillaTronc from './components/PlantillaTronc';

function App() {

  return (
    <div className="App">
      <Navbar />
      <PlantillaTronc files={3} columnes={3} />
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
        <Route path="/assaig/:id" element={<DetallsAssaig />} />
        <Route path="/crear-diada" element={<CrearDiada />} />
        <Route path="/diada/:id" element={<DetallsDiada />} />
      </Routes>
    </div>
  );
}

export default App;
