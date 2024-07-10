import React, { useState } from 'react';
import '../css/App.css';

export const NouAssaig = ({ setShowNouAssaig }) => {

  const [dia, setDia] = useState('');
  const [lloc, setLloc] = useState('0');
  const [hora, setHora] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(`Assaig creat: Dia - ${dia}, Lloc - ${lloc}, Hora - ${hora}`);
    setShowNouAssaig(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Dia:</label>
        <input type="date" value={dia} onChange={(e) => setDia(e.target.value)} required />
      </div>
      <div className="form-group">
        <label>Lloc:</label>
        <select value={lloc} onChange={(e) => setLloc(e.target.value)} required>
            <option value="0" disabled>Selecciona un lloc</option>
            <option value="TecnoCampus">Plaça del TecnoCampus</option>
            <option value="Local">Local de Capgrossos</option>
        </select>
      </div>
      <div className="form-group">
        <label>Hora:</label>
        <input type="time" value={hora} onChange={(e) => setHora(e.target.value)} required />
      </div>
      <button type="submit">Guardar</button>
      <button type="button" onClick={() => setShowNouAssaig(false)}>Cancel·lar</button>
    </form>
  );
};

export default NouAssaig;

