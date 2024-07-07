import React, { useEffect, useState } from 'react';
import './App.css';
import { PrimerComponent } from './components/PrimerComponent';
import { SegonComponent } from './components/SegonComponent';

function App() {

  const [backEndData, setBackEndData] = useState([{}]);
 
  useEffect(() => {
    fetch('/api')
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
