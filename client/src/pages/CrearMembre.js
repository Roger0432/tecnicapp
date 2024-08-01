import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function CrearMembre() {
  const [mote, setMote] = useState('');
  const [nom, setNom] = useState('');
  const [cognoms, setCognoms] = useState('');
  const [alcadaHombro, setAlcadaHombro] = useState('');
  const [alcadaMans, setAlcadaMans] = useState('');
  const [comentaris, setComentaris] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();  

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

    fetch(`${BACKEND_URL}/crear-membre`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(data => {
        if (data.status) {
          Swal.fire({
            title: 'Membre creat',
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
      <h1>Nou membre</h1>

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

        <button type="submit">Crear</button>
        <div className="error">{error}</div>
      </form>
    </div>
  );
}

export default CrearMembre;
