import React, { useState } from 'react';
import '../css/App.css';

const CrearAssaig = ({ setCurrentComponent }) => {

  const [dia, setDia] = useState('');
  const [lloc, setLloc] = useState('0');
  const [hora, setHora] = useState('');
  const [error, setError] = useState('');


  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    console.log(`Assaig creat: Dia - ${dia}, Lloc - ${lloc}, Hora - ${hora}`);
    setCurrentComponent(null);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Dia:</label>
        <input type="date" value={dia} onChange={(e) => setDia(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Lloc:</label>
        <select value={lloc} onChange={(e) => setLloc(e.target.value)} >
            <option value="0" disabled>Selecciona un lloc</option>
            <option value="Plaça del TecnoCampus">Plaça del TecnoCampus</option>
            <option value="Loca de Capgrossos">Local de Capgrossos</option>
        </select>
      </div>
      <div className="form-group">
        <label>Hora:</label>
        <input type="time" value={hora} onChange={(e) => setHora(e.target.value)} />
      </div>
      <button type="submit">Guardar</button>
      <button type="button" onClick={() => setCurrentComponent(null)}>Cancel·lar</button>
      <div className="error">{error}</div>
    </form>
  );
};

export default CrearAssaig;