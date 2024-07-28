import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CiCalendarDate, CiClock1, CiLocationOn } from "react-icons/ci";
import '../styles/DetallsEsdeveniment.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function DetallsEsdeveniment() {
  const [detalls, setDetalls] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    fetch(`${BACKEND_URL}/esdeveniment/${id}`)
      .then(response => response.json())
      .then(data => {
        if (data.status) {
          setDetalls(data.esdeveniment);
        } else {
          console.error(data.msg);
        }
      })
      .catch(error => console.error('Error:', error));
  }, [id]);

  if (!detalls) {
    return <div>Carregant...</div>;
  }

  return (
    <div className="page">
      <h1>{detalls.nom}</h1>
      <div className="detalls">
        <span className="detall-item"><CiCalendarDate /> {detalls.dia}</span>
        <span className="detall-item"><CiClock1 /> {detalls.hora_inici} - {detalls.hora_fi}</span>
        <span className="detall-item"><CiLocationOn /> {detalls.lloc}</span>
      </div>

      {console.log('DetallsEsdeveniment: ',detalls)}
      {detalls.assaig ? (
        <>
          <h2>Proves</h2> 
          <Link className='link' to={`/nova-prova/${id}`}>
            Nova prova
          </Link>

          {detalls.castells[0] !== null ? (
            detalls.castells.map((prova, index) => (
              <div key={index}>
                <Link className='link' to={`/prova/${detalls.id[index]}`}>
                  {prova}
                </Link>
              </div>
            ))
          ) : null}
  
        </>
      ) : (
        <>
          <h2>Castells</h2>
          <Link className="link" to={`/nou-castell/${id}`}>
            Nou castell
          </Link>

          {detalls.castells[0] !== null ? (
            detalls.castells.map((castell, index) => (
              <div key={index}>
                <Link className='link' to={`/castell/${detalls.id[index]}`}>
                  {castell}
                </Link>
              </div>
            ))
          ) : null}

        </>
      )}
    </div>
  );
}

export default DetallsEsdeveniment;
