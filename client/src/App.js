import React, { useState } from 'react';
import './App.css';
import { LoginComponent } from './components/LoginComponent';
import { RegisterComponent } from './components/RegisterComponent';

//const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
//const BACKEND_URL = "";

function App() {

  const [mostrarLogin, setMostrarLogin] = useState(true);

  const canviarMostrarLogin = () => setMostrarLogin(!mostrarLogin);

  return (
    <div className="App">

      <h1>TECNICAPP</h1>

      {mostrarLogin ? (
        <LoginComponent canviarMostrarLogin={canviarMostrarLogin} />
      ) : ( <RegisterComponent canviarMostrarLogin={canviarMostrarLogin} /> )}

    </div>
  );
}

export default App;