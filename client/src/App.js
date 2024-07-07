import React, { useEffect, useState } from 'react';
import './App.css';
import { PrimerComponent } from './components/PrimerComponent';
import { SegonComponent } from './components/SegonComponent';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
//const BACKEND_URL = "";

function App() {

  const [backEndData, setBackEndData] = useState([{}]);
 
  useEffect(() => {
    fetch(`${BACKEND_URL}/api`)
      .then(res => res.json())
      .then(data => setBackEndData(data));
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



        <PrimerComponent/>
        <SegonComponent/>
      </header>
    </div>
  );
}

export default App;
