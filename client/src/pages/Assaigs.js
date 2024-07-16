import React, { useState, useEffect } from 'react';
import { IoSearchOutline } from 'react-icons/io5';
import '../styles/Assaigs.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function Assaigs() {
  const [assaigs, setAssaigs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  useEffect(() => {
    fetch(`${BACKEND_URL}/assaigs`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then(response => response.json())
      .then(data => {
        const updatedAssaigs = data.assaigs.map(assaig => ({
          ...assaig,
          diaSetmana: getDiaSetmana(assaig.dia),
          hora: `${assaig.hora_inici} - ${assaig.hora_fi}`,
          castells: ''
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
              <th onClick={() => requestSort('nom')}>Nom</th>
              <th onClick={() => requestSort('diaSetmana')}>Dia de la Setmana</th>
              <th onClick={() => requestSort('dia')}>Dia</th>
              <th onClick={() => requestSort('hora')}>Hora</th>
              <th onClick={() => requestSort('lloc')}>Lloc</th>
              <th>Castells</th>
            </tr>
          </thead>
          <tbody>
            {filteredAssaigs.map((assaig, index) => (
              <tr key={index}>
                <td>{assaig.nom}</td>
                <td>{assaig.diaSetmana}</td>
                <td>{assaig.dia}</td>
                <td>{assaig.hora}</td>
                <td>{assaig.lloc}</td>
                <td>{assaig.castells}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Assaigs;
