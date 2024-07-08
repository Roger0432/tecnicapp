import React, { useEffect, useState } from 'react';
import './App.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
//const BACKEND_URL = "";

function App() {
  const [backEndData, setBackEndData] = useState([{}]);
  const [users, setUsers] = useState([]);
   
  useEffect(() => {
    fetch(`${BACKEND_URL}/api`)
      .then(res => res.json())
      .then(data => setBackEndData(data));
  }, []);

  useEffect(() => {
    fetch(`${BACKEND_URL}/users`)
      .then(res => res.json())
      .then(data => setUsers(data));
  }, []);

  return (
    <div className="App">
      <header className="App-header">    

        <p>Data from back-end:</p>
        <ul>
          {backEndData.users && backEndData.users.map((user, index) => (
            <li key={index}>{user}</li>
          ))}
        </ul>

        <p>Data from database:</p>
        <ul>
          {users.map((user, index) => (
            <li key={index}>{user.name} - {user.username} - {user.email}</li>
          ))}
        </ul>

      </header>
    </div>
  );
}

export default App;