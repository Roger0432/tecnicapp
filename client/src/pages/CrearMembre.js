import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function CrearMembre() {
  const navigate = useNavigate();
  const location = useLocation();
  const { membre = {}, editar = false } = location.state || {};
  
  const [mote, setMote] = useState(membre.mote || '');
  const [nom, setNom] = useState(membre.nom || '');
  const [cognoms, setCognoms] = useState(membre.cognoms || '');
  const [alcadaHombro, setAlcadaHombro] = useState(membre.alcada_hombro || '');
  const [alcadaMans, setAlcadaMans] = useState(membre.alcada_mans || '');
  const [comentaris, setComentaris] = useState(membre.comentaris || '');
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    if (mote === '' || nom === '') {
      setError("Has d'omplir els camps nom i mote");
      return;
    }

    const data = { 
      mote, 
      nom, 
      cognoms, 
      alcada_hombro: alcadaHombro ? parseFloat(alcadaHombro) : 0, 
      alcada_mans: alcadaMans ? parseFloat(alcadaMans) : 0, 
      comentaris 
    };

    let url = `${BACKEND_URL}`;
    if (editar) url += `/editar-membre/${membre.id}`;
    else url += '/crear-membre';

    const method = editar ? 'PUT' : 'POST';

    fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(data => {
        if (data.status) {
          Swal.fire({
            title: editar ? 'Membre actualitzat' : 'Membre creat',
            icon: 'success',
            showConfirmButton: false,
            timer: 1000
          })
          .then(() => navigate('/membres'));
        } else {
          console.error('Error:', data.msg);
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  return (
    <div className="page">
      <h2>{editar ? 'Editar Membre' : 'Crear Membre'}</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="mote">Mote</label>
          <input value={mote} onChange={(e) => setMote(e.target.value)} type="text" id="mote" name="mote" placeholder="Mote" autoComplete="nickname" />
        </div>

        <div className="form-group">
          <label htmlFor="nom">Nom</label>
          <input value={nom} onChange={(e) => setNom(e.target.value)} type="text" id="nom" name="nom" placeholder="Nom" autoComplete="given-name" />
        </div>

        <div className="form-group">
          <label htmlFor="cognoms">Cognoms</label>
          <input value={cognoms} onChange={(e) => setCognoms(e.target.value)} type="text" id="cognoms" name="cognoms" placeholder="Cognoms" autoComplete="family-name" />
        </div>

        <div className="form-group">
          <label htmlFor="alcada_hombro">Alçada de l'hombro</label>
          <input value={alcadaHombro} onChange={(e) => setAlcadaHombro(e.target.value)} type="number" id="alcada_hombro" name="alcada_hombro" placeholder="Alçada de l'hombro" />
        </div>

        <div className="form-group">
          <label htmlFor="alcada_mans">Alçada de les mans</label>
          <input value={alcadaMans} onChange={(e) => setAlcadaMans(e.target.value)} type="number" id="alcada_mans" name="alcada_mans" placeholder="Alçada de les mans" />
        </div>

        <div className="form-group">
          <label htmlFor="comentaris">Comentaris</label>
          <textarea value={comentaris} onChange={(e) => setComentaris(e.target.value)} id="comentaris" name="comentaris" placeholder="Comentaris"></textarea>
        </div>

        <button type="submit">{editar ? 'Guardar' : 'Crear'}</button>
        <div className="error">{error}</div>
      </form>
    </div>
  );
}

export default CrearMembre;
