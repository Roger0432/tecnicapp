import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/App.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function CrearAssaig () {

  const [dia, setDia] = useState('');
  const [lloc, setLloc] = useState('0');
  const [hora, setHora] = useState('');
  const [error, setError] = useState('');
  const [nom, setNom] = useState('Assaig general');
  const navigate = useNavigate();
  const assaig = true;
  

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (dia === '' || lloc === '0' || hora === '' || nom === '') {
      setError('Has d\'omplir tots els camps');
      return;
    }

    fetch(`${BACKEND_URL}/crear-assaig`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dia, lloc, hora, assaig, nom }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.status) {
        navigate('/assaig/' + data.id);
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
      <form onSubmit={handleSubmit}>

        <div className="form-group">
          <label>Nom </label>
          <input type="text" value={nom} onChange={(e) => setNom(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Dia </label>
          <input type="date" value={dia} onChange={(e) => setDia(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Lloc </label>
          <select value={lloc} onChange={(e) => setLloc(e.target.value)} >
              <option value="0" disabled>Selecciona un lloc</option>
              <option value="Plaça del TecnoCampus">Plaça del TecnoCampus</option>
              <option value="Local de Capgrossos">Local de Capgrossos</option>
          </select>
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

export default CrearAssaig;