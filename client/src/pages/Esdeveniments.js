import React, { useState, useEffect } from 'react';
import { IoSearchOutline } from 'react-icons/io5';
import { MdDeleteOutline, MdEdit } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../styles/Table.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function Esdeveniments({ assaig }) {
  const [esdeveniments, setEsdeveniments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${BACKEND_URL}/esdeveniments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ assaig }),
    })
      .then(response => response.json())
      .then(data => {
        const updatedEsdeveniment = data.esdeveniments.map(esdeveniment => ({
          ...esdeveniment,  
          diaSetmana: getDiaSetmana(esdeveniment.dia),
          hora: `${esdeveniment.hora_inici} - ${esdeveniment.hora_fi}`,
        }));
        setEsdeveniments(updatedEsdeveniment);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, [assaig]);

  const getDiaSetmana = (dateString) => {
    const diasSetmana = ['Diumenge', 'Dilluns', 'Dimarts', 'Dimecres', 'Dijous', 'Divendres', 'Dissabte'];
    const dateParts = dateString.split('-');
    const date = new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`);
    return diasSetmana[date.getDay()];
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const sortedEsdeveniments = [...esdeveniments].sort((a, b) => {
    if (sortConfig.key) {
      const direction = sortConfig.direction === 'asc' ? 1 : -1;
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return -1 * direction;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return 1 * direction;
      }
      return 0;
    }
    return 0;
  });

  const filteredEsdeveniments = sortedEsdeveniments.filter(esdeveniment =>
    Object.values(esdeveniment).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const detallsEsdeveniment = (id) => {
    if (assaig) {
      navigate(`/assaig/${id}`);
    } else {
      navigate(`/diada/${id}`);
    }
  };

  const borrarEsdeveniment = (id) => {
    Swal.fire({
      title: 'Estàs segur?',
      text: "No podràs recuperar aquest esdeveniment!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, esborra!',
      cancelButtonText: 'Cancel·la'
    })
    .then((result) => {
      if (result.isConfirmed) {
        fetch(`${BACKEND_URL}/borrar-esdeveniment/${id}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
        })
        .then(response => response.json())
        .then(data => {
          if (data.status) {
            setEsdeveniments(esdeveniments.filter(esdeveniment => esdeveniment.id !== id));
              Swal.fire({
                  title: 'Esborrat!',
                  icon: 'success',
                  timer: 1000,
                  showConfirmButton: false
              });
          } else {
            console.error('Failed to delete esdeveniment');
          }
        })
        .catch(error => {
          console.error('Error:', error);
        });
      }
    });
  };

  const editarEsdeveniment = (esdeveniment) => {
    if (assaig) {
      navigate('/editar-assaig', { state: { esdeveniment, editar: true } });
    } else {
      navigate('/editar-diada', { state: { esdeveniment, editar: true } });
    }
  };

  return (
    <div className='page'>
      {assaig ? <h1>Assaigs</h1> : <h1>Diades</h1>}

      <div className='table-container'>
        <div className="search-bar-container">
          <IoSearchOutline className="search-icon" />
          <input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-bar"
          />
        </div>
        <table>
          <thead>
            <tr>
              <th 
                onClick={() => requestSort('nom')} 
                className={sortConfig.key === 'nom' ? 'active' : ''}
              >Nom</th>
              <th 
                onClick={() => requestSort('diaSetmana')} 
                className={sortConfig.key === 'diaSetmana' ? 'active' : ''}
              >Dia</th>
              <th 
                onClick={() => requestSort('dia')} 
                className={sortConfig.key === 'dia' ? 'active' : ''}
              >Data</th>
              <th 
                onClick={() => requestSort('hora')} 
                className={sortConfig.key === 'hora' ? 'active' : ''}
              >Hora</th>
              <th 
                onClick={() => requestSort('lloc')} 
                className={sortConfig.key === 'lloc' ? 'active' : ''}
              >Lloc</th>
              <th>Accions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEsdeveniments.map((esdeveniment, index) => (
              <tr key={index}>
                <td onClick={() => detallsEsdeveniment(esdeveniment.id)}>{esdeveniment.nom}</td>
                <td onClick={() => detallsEsdeveniment(esdeveniment.id)}>{esdeveniment.diaSetmana}</td>
                <td onClick={() => detallsEsdeveniment(esdeveniment.id)}>{esdeveniment.dia}</td>
                <td onClick={() => detallsEsdeveniment(esdeveniment.id)}>{esdeveniment.hora}</td>
                <td onClick={() => detallsEsdeveniment(esdeveniment.id)}>{esdeveniment.lloc}</td>
                <td>
                  <MdEdit className="action-icon" onClick={() => editarEsdeveniment(esdeveniment)} />
                  <MdDeleteOutline className="action-icon" onClick={() => borrarEsdeveniment(esdeveniment.id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Esdeveniments;
