import React, { useState } from 'react';
import './App.css';
import { LoginComponent } from './components/LoginComponent';
import { RegisterComponent } from './components/RegisterComponent';
import { MainComponent } from './components/MainComponent';

function App() {

  const [authSuccess, setAuthSuccess] = useState(false);
  const [mostrarLogin, setMostrarLogin] = useState(true);

  const canviarMostrarLogin = () => setMostrarLogin(!mostrarLogin);

  return (
    <div className="App">

      <h1>TECNICAPP</h1>

      {authSuccess ? (
        <MainComponent />
      ) : (
        mostrarLogin ? 
        ( <LoginComponent onAuthSuccess={() => setAuthSuccess(true)} canviarMostrarLogin={canviarMostrarLogin} /> ) : 
        ( <RegisterComponent onAuthSuccess={() => setAuthSuccess(true)} canviarMostrarLogin={canviarMostrarLogin} /> )
      )}

    </div>
  );
}

export default App;