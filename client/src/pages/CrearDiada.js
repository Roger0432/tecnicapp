import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/App.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function CrearDiada () {

  const [dia, setDia] = useState('');
  const [lloc, setLloc] = useState('');
  const [hora, setHora] = useState('');
  const [error, setError] = useState('');
  const [nom, setNom] = useState('');
  const navigate = useNavigate();
  const assaig = false;
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (dia === '' || lloc === '' || hora === '' || nom === '') {
      setError('Has d\'omplir tots els camps');
      return;
    }

    fetch(`${BACKEND_URL}/crear-diada`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dia, lloc, hora, assaig, nom }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.status) {
        navigate('/diada/' + data.id);
      } 
      else {
        setError(data.msg);
      }
    })
    .catch(error => {
      console.error('Error:', error);
      setError('Error del servidor');
    });
    
  };

  return (
    <div className='page'>

        <h2>Crear diada</h2>

        <form onSubmit={handleSubmit}>

            <div className="form-group">
                <label>Nom </label>
                <input type="text" value={nom} onChange={(e) => setNom(e.target.value)} placeholder='Nom de la diada' />
            </div>

            <div className="form-group">
                <label>Dia </label>
                <input type="date" value={dia} onChange={(e) => setDia(e.target.value)} />
            </div>

            <div className="form-group">
                <label>Lloc </label>
                <input type="text" value={lloc} onChange={(e) => setLloc(e.target.value)} placeholder='Lloc de la diada' />
            </div>

            <div className="form-group">
                <label>Hora </label>
                <input type="time" value={hora} onChange={(e) => setHora(e.target.value)} />
            </div>

            <button type="submit">Guardar</button>
            <Link to="/main"> <button>Cancel·lar</button> </Link>
            <div className="error">{error}</div>

        </form>
    </div>
  );
};

export default CrearDiada;