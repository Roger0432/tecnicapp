import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IoSearchOutline } from 'react-icons/io5';
import { MdDeleteOutline, MdEdit } from "react-icons/md";
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function Membres() {
  const [membres, setMembres] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${BACKEND_URL}/membres`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then(response => response.json())
      .then(data => {
        if (data.status) {
          setMembres(data.membres);
        } else {
          console.error('Error:', data.msg);
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const sortedMembres = [...membres].sort((a, b) => {
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

  const filteredMembres = sortedMembres.filter(membre =>
    Object.values(membre).some(value =>
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

  const borrarMembre = (id) => {
    Swal.fire({
      title: 'Estàs segur?',
      text: "No podràs recuperar aquest membre!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, esborra!',
      cancelButtonText: 'Cancel·la'
    })
    .then((result) => {
      if (result.isConfirmed) {
        fetch(`${BACKEND_URL}/borrar-membre/${id}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
        })
        .then(response => response.json())
        .then(data => {
          if (data.status) {
            setMembres(membres.filter(membre => membre.id !== id));
            Swal.fire({
              title: 'Esborrat!',
              icon: 'success',
              timer: 1000,
              showConfirmButton: false
            });
          } else {
            console.error('Failed to delete membre');
          }
        })
        .catch(error => {
          console.error('Error:', error);
        });
      }
    });
  };

  const editarMembre = (membre) => {
    navigate('/editar-membre', { state: { membre, editar: true } });
  };

  return (
    <div className='page'>
      <h1>Membres</h1>

      <Link to="/crear-membre" className="link">Crear membre</Link>

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
                onClick={() => requestSort('mote')} 
                className={sortConfig.key === 'mote' ? 'active' : ''}
              >Mote</th>
              <th 
                onClick={() => requestSort('nom')} 
                className={sortConfig.key === 'nom' ? 'active' : ''}
              >Nom</th>
              <th 
                onClick={() => requestSort('cognoms')} 
                className={sortConfig.key === 'cognoms' ? 'active' : ''}
              >Cognoms</th>
              <th 
                onClick={() => requestSort('alcada_hombro')} 
                className={sortConfig.key === 'alcada_hombro' ? 'active' : ''}
              >Alçada hombro</th>
              <th 
                onClick={() => requestSort('alcada_mans')} 
                className={sortConfig.key === 'alcada_mans' ? 'active' : ''}
              >Alçada mans</th>
              <th 
                onClick={() => requestSort('comentaris')} 
                className={sortConfig.key === 'comentaris' ? 'active' : ''}
              >Comentaris</th>
              <th>Accions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMembres.map((membre, index) => (
              <tr key={index}>
                <td>{membre.mote}</td>
                <td>{membre.nom}</td>
                <td>{membre.cognoms}</td>
                <td>{membre.alcada_hombro + ' cm'}</td>
                <td>{membre.alcada_mans + ' cm'}</td>
                <td>{membre.comentaris}</td>
                <td>
                  <MdEdit className="action-icon" onClick={() => editarMembre(membre)} />
                  <MdDeleteOutline className="action-icon" onClick={() => borrarMembre(membre.id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Membres;
