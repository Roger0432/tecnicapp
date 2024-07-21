import React, { useState, useEffect } from 'react';
import { IoSearchOutline } from 'react-icons/io5';
import { MdDeleteOutline } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../styles/Table.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function Assaigs() {
  const [assaigs, setAssaigs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const navigate = useNavigate();

  useEffect(() => {
    const assaig = false;

    fetch(`${BACKEND_URL}/diades`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ assaig }),
    })
      .then(response => response.json())
      .then(data => {
        const updatedAssaigs = data.assaigs.map(assaig => ({
          ...assaig,
          diaSetmana: getDiaSetmana(assaig.dia),
          hora: `${assaig.hora_inici} - ${assaig.hora_fi}`,
        }));
        setAssaigs(updatedAssaigs);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, []);

  const getDiaSetmana = (dateString) => {
    const diasSetmana = ['Diumenge', 'Dilluns', 'Dimarts', 'Dimecres', 'Dijous', 'Divendres', 'Dissabte'];
    const dateParts = dateString.split('-');
    const date = new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`);
    return diasSetmana[date.getDay()];
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const sortedAssaigs = [...assaigs].sort((a, b) => {
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

  const filteredAssaigs = sortedAssaigs.filter(assaig =>
    Object.values(assaig).some(value =>
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

  const detallsAssaig = (id) => {
    navigate('/diada/' + id);
  };

  const borrarAssaig = (id) => {
    Swal.fire({
      title: 'Estàs segur?',
      text: "No podràs recuperar aquesta diada!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, esborra!',
      cancelButtonText: 'Cancel·la'
    })
    .then((result) => {
      if (result.isConfirmed) {
        fetch(`${BACKEND_URL}/borrar-assaig/${id}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
        })
        .then(response => response.json())
        .then(data => {
          if (data.status) {
            setAssaigs(assaigs.filter(assaig => assaig.id !== id));
            Swal.fire(
              'Esborrat!',
              "L'assaig ha estat esborrat.",
              'success'
            );
          } else {
            console.error('Failed to delete assaig');
          }
        })
        .catch(error => {
          console.error('Error:', error);
        });
      }
    });
  };

  return (
    <div className='page'>
      <h2>Assaigs</h2>
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
              <th>Borrar</th>
            </tr>
          </thead>
          <tbody>
            {filteredAssaigs.map((assaig, index) => (
              <tr key={index}>
                <td onClick={() => detallsAssaig(assaig.id)}>{assaig.nom}</td>
                <td onClick={() => detallsAssaig(assaig.id)}>{assaig.diaSetmana}</td>
                <td onClick={() => detallsAssaig(assaig.id)}>{assaig.dia}</td>
                <td onClick={() => detallsAssaig(assaig.id)}>{assaig.hora}</td>
                <td onClick={() => detallsAssaig(assaig.id)}>{assaig.lloc}</td>
                <td>
                  <MdDeleteOutline className="delete-icon" onClick={() => borrarAssaig(assaig.id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Assaigs;
