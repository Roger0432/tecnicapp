import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function DetallsEsdeveniment() {
  const [detalls, setDetalls] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    fetch(`${BACKEND_URL}/esdeveniment/${id}`)
      .then(response => response.json())
      .then(data => setDetalls(data.esdeveniment))
      .catch(error => console.error('Error:', error));
  }, [id]);

  if (!detalls) {
    return <div>Carregant...</div>;
  }

  return (
    <div className="page">
      <h1>Detalls de l'Esdeveniment</h1>
      <p><strong>Nom: </strong> {detalls.nom}</p>
      <p><strong>Dia: </strong> {detalls.dia}</p>
      <p><strong>Lloc: </strong> {detalls.lloc}</p>
      <p><strong>Hora: </strong> {detalls.hora_inici}</p>
    </div>
  );
}

export default DetallsEsdeveniment;