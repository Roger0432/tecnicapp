import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function AfegirCastell({ assaig }) {
  const [castells, setCastells] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCastells, setFilteredCastells] = useState([]);
  const [selectedCastells, setSelectedCastells] = useState([]);
  const [selectedCastellId, setSelectedCastellId] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${BACKEND_URL}/castells`)
      .then(response => response.json())
      .then(data => {
        if (data.status) {
          setCastells(data.castells);
          setFilteredCastells(data.castells);
          if (data.castells.length > 0) {
            setSelectedCastellId(data.castells[0].id.toString());
          }
        } else {
          console.error(data.msg);
        }
      })
      .catch(error => console.error('Error:', error));
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    const filtered = castells.filter(castell =>
      castell.nom.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredCastells(filtered);
    if (filtered.length > 0) {
      setSelectedCastellId(filtered[0].id.toString());
    } else {
      setSelectedCastellId('');
    }
  };

  const handleSelectChange = (e) => {
    setSelectedCastellId(e.target.value);
  };

  const afegirCastell = () => {
    const selectedCastell = castells.find(castell => castell.id === parseInt(selectedCastellId));
    if (selectedCastell && !selectedCastells.includes(selectedCastell)) {
      setSelectedCastells([...selectedCastells, selectedCastell]);
    }
  };

  const esborrarCastell = (id) => {
    setSelectedCastells(selectedCastells.filter(castell => castell.id !== id));
  };

  const guardarCanvis = () => {
    fetch(`${BACKEND_URL}/guardar-castells`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ castells: selectedCastells, esdeveniment_id: id }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.status) {
          navigate(assaig ? `/assaig/${id}` : `/diada/${id}`);
        } else {
          console.error(data.msg);
        }
      })
      .catch(error => console.error('Error:', error));
  };

  return (
    <div className="page">
      {assaig ? (
        <>
          <h1>Afegir proves</h1>
          <p>Selecciona les proves que vols afegir</p>
        </>
      ) : (
        <>
          <h1>Afegir castells</h1>
          <p>Selecciona els castells que vols afegir</p>
        </>
      )}

      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Cerca..."
      />
      <br />
      <select name="castell" id="castell" value={selectedCastellId} onChange={handleSelectChange}>
        {filteredCastells.map((castell, index) => (
          <option key={index} value={castell.id}>{castell.nom}</option>
        ))}
      </select>

      <div>
        <button onClick={afegirCastell}>Afegir</button>
      </div>

      <ul>
        {selectedCastells.map((castell) => (
          <li key={castell.id}>
            {castell.nom}
            <button onClick={() => esborrarCastell(castell.id)}>Eliminar</button>
          </li>
        ))}
      </ul>

      <div>
        <button onClick={guardarCanvis}>Guardar canvis</button>
      </div>
    </div>
  );
}

export default AfegirCastell;
