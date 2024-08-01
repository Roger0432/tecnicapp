import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CiCalendarDate, CiClock1, CiLocationOn } from "react-icons/ci";
import '../styles/DetallsEsdeveniment.css';
import Swal from 'sweetalert2';

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

  const borrarCastell = (id) => {
    Swal.fire({
      title: 'Estàs segur?',
      text: `No podràs recuperar ${detalls.assaig ? 'aquesta prova!' : 'aquest castell!'}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, esborra!',
      cancelButtonText: 'Cancel·la'
    })
    .then((result) => {
      if (result.isConfirmed) {
        fetch(`${BACKEND_URL}/borrar-castell/${id}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
        })
        .then(response => response.json())
        .then(data => {
          if (data.status) {
            Swal.fire({
              title: 'Esborrat!',
              icon: 'success',
              timer: 1000,
              showConfirmButton: false
            })
            .then(() => window.location.reload());
          } else {
            console.error('Failed to delete castell');
          }
        })
        .catch(error => {
          console.error('Error:', error);
        });
      }
    });
  };

  if (!detalls) {
    return <div>Carregant...</div>;
  }

  return (
    <div className="page">
      <h1>{detalls.nom}</h1>
      <div className="detalls">
        <div className="detall-item"><CiCalendarDate /> {detalls.dia}</div>
        <div className="detall-item"><CiClock1 /> {detalls.hora_inici} - {detalls.hora_fi}</div>
        <div className="detall-item"><CiLocationOn /> {detalls.lloc}</div>
      </div>

      {detalls.assaig ? (
        <>
          <h2>Proves</h2> 
          <Link className='link' to={`/nova-prova/${id}`}>
            Nova prova
          </Link>

          {detalls.castells[0] !== null ? (
            detalls.castells.map((prova, index) => (
              <div key={index} className='prova'>
                <Link className='link' to={`/prova/${detalls.id[index]}`}>
                  {prova}
                </Link>
                <button onClick={() => borrarCastell(detalls.id[index])}>Esborra</button>
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
              <div key={index} className='castell'>
                <Link className='link' to={`/castell/${detalls.id[index]}`}>
                  {castell}
                </Link>
                <button onClick={() => borrarCastell(detalls.id[index])}>Esborra</button>
              </div>
            ))
          ) : null}

        </>
      )}
    </div>
  );
}

export default DetallsEsdeveniment;
