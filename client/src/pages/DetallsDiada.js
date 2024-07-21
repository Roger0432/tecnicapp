import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function DetallsAssaig() {
  const [assaig, setAssaig] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    fetch(`${BACKEND_URL}/diada/${id}`)
      .then(response => response.json())
      .then(data => setAssaig(data.assaig))
      .catch(error => console.error('Error:', error));
  }, [id]);

  if (!assaig) {
    return <div>Carregant...</div>;
  }

  return (
    <div className="page">
      <h1>Detalls de la diada</h1>
      <p><strong>Nom: </strong> {assaig.nom}</p>
      <p><strong>Dia: </strong> {assaig.dia}</p>
      <p><strong>Lloc: </strong> {assaig.lloc}</p>
      <p><strong>Hora: </strong> {assaig.hora_inici}</p>
    </div>
  );
}

export default DetallsAssaig;