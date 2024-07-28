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
import EditarCastell from './pages/EditarCastell';
import CrearCastell from './pages/CrearCastell';

function App() {

  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/inicisessio" element={<IniciSessio />} />
        <Route path="/registre" element={<Registre />} />

        <Route path="/" element={<Main />} />
        <Route path="/main" element={<Main />} />

        <Route path="/membres" element={<Membres />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/configuracio" element={<Configuracio />} />

        <Route path="/assaigs" element={<Esdeveniments assaig={true} />} />
        <Route path="/diades" element={<Esdeveniments assaig={false} />} />

        <Route path="/crear-assaig" element={<CrearEsdeveniment assaig={true} />} /> 
        <Route path="/crear-diada" element={<CrearEsdeveniment assaig={false} />} />

        <Route path="/assaig/:id" element={<DetallsEsdeveniment />} />
        <Route path="/diada/:id" element={<DetallsEsdeveniment />} />

        <Route path="prova/:id" element={<EditarCastell />} />
        <Route path="castell/:id" element={<EditarCastell />} />

        <Route path="/nova-prova/:id" element={<CrearCastell assaig={true} />} />
        <Route path="/nou-castell/:id" element={<CrearCastell assaig={false} />} />


      </Routes>
    </div>
  );
}

export default App;
