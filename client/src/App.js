import React from 'react';
import { Routes, Route, } from 'react-router-dom';
import IniciSessio from './pages/IniciSessio';
import Registre from './pages/Registre';
import Navbar from './components/Navbar';
import Main from './pages/Main';
import Esdeveniments from './pages/Esdeveniments';
import Membres from './pages/Membres';
import Perfil from './pages/Perfil';
import Configuracio from './pages/Configuracio';
import CrearEsdeveniment from './pages/CrearEsdeveniment';
import DetallsEsdeveniment from './pages/DetallsEsdeveniment';
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
        <Route path="/assaigs" element={<Esdeveniments assaig={true} />} />
        <Route path="/diades" element={<Esdeveniments assaig={false} />} />
        <Route path="/membres" element={<Membres />} />

        <Route path="/perfil" element={<Perfil />} />
        <Route path="/configuracio" element={<Configuracio />} />

        <Route path="/crear-assaig" element={<CrearEsdeveniment assaig={true} />} />
        <Route path="/assaig/:id" element={<DetallsEsdeveniment assaig={true} />} />
        <Route path="/crear-diada" element={<CrearEsdeveniment assaig={false} />} />
        <Route path="/diada/:id" element={<DetallsEsdeveniment assaig={false} />} />
      </Routes>
    </div>
  );
}

export default App;
