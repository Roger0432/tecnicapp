import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/App.css';
import Swal from 'sweetalert2';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function CrearEsdeveniment ({ assaig }) {

  const text_nom = assaig ? 'Assaig general' : '';
  
  const navigate = useNavigate();
  const location = useLocation();
  const { esdeveniment = {}, editar = false } = location.state || {};

  const formatDate = (date) => {
    const dateParts = date.split('-');
    return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
  };
  
  const [nom, setNom] = useState(esdeveniment.nom || text_nom);
  const [dia, setDia] = useState(formatDate(esdeveniment.dia) || '');
  const [lloc, setLloc] = useState(esdeveniment.lloc || '0');
  const [hora, setHora] = useState(esdeveniment.hora_inici || '');
  const [error, setError] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (dia === '' || lloc === '0' || hora === '' || nom === '') {
      setError('Has d\'omplir tots els camps');
      return;
    }

    const data = { dia, lloc, hora, nom };

    let url = `${BACKEND_URL}`;
    if (editar) url += `/editar-esdeveniment/${esdeveniment.id}`;
    else url += '/crear-esdeveniment';

    const method = editar ? 'PUT' : 'POST';

    fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
      if (data.status) {
        const title = assaig ? 'Assaig guardat correctament' : 'Diada guardada correctament';
        Swal.fire({
          icon: 'success',
          title: title,
          showConfirmButton: false,
          timer: 1000
        })
        .then(() => {
          if (assaig) {
            navigate('/assaigs');
          } else {
            navigate('/diades');
          }
        });
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

    {assaig ? (
      <>
        { editar ? <h1>Editar assaig</h1> : <h1>Crear assaig</h1> }

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nom </label>
            <input
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              placeholder="Nom de l'assaig"
            />
          </div>

          <div className="form-group">
            <label>Dia </label>
            <input
              type="date"
              value={dia}
              onChange={(e) => setDia(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Lloc </label>
            <select value={lloc} onChange={(e) => setLloc(e.target.value)}>
              <option value="0" disabled>
                Selecciona un lloc
              </option>
              <option value="Plaça del TecnoCampus">Plaça del TecnoCampus</option>
              <option value="Local de Capgrossos">Local de Capgrossos</option>
            </select>
          </div>

          <div className="form-group">
            <label>Hora </label>
            <input
              type="time"
              value={hora}
              onChange={(e) => setHora(e.target.value)}
            />
          </div>

          <button type="submit">Guardar</button>
          <div className="error">{error}</div>
        </form>
      </>
    ) : (
      <>
        { editar ? <h2>Editar diada</h2> : <h2>Crear diada</h2> }

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nom </label>
            <input
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              placeholder="Nom de la diada"
            />
          </div>

          <div className="form-group">
            <label>Dia </label>
            <input
              type="date"
              value={dia}
              onChange={(e) => setDia(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Lloc </label>
            <input
              type="text"
              value={lloc}
              onChange={(e) => setLloc(e.target.value)}
              placeholder="Lloc de la diada"
            />
          </div>

          <div className="form-group">
            <label>Hora </label>
            <input
              type="time"
              value={hora}
              onChange={(e) => setHora(e.target.value)}
            />
          </div>

          <button type="submit">Guardar</button>
          <div className="error">{error}</div>
        </form>
      </>
    )}

  </div>
  );
};

export default CrearEsdeveniment;