import React/*, { useState, useEffect }*/ from 'react';
import '../styles/App.css'
import { Link } from 'react-router-dom';
import '../styles/Tronc.css';

function Main () {
  /* 
  const [tronc, setTronc] = useState([]);

  useEffect(() => {
    carregarTaula();
  }, []);

  const carregarTaula = () => {
    const taula = [];
    for (let i = 0; i < 3; i++) {
      const fila = [];
      for (let j = 0; j < 3; j++) {
        fila.push(`[${i},${j}]`);
      }
      taula.push(fila);
    }

    setTronc(taula);
  }

  const canviaTronc = (i, j) => {
    const nouTronc = [...tronc];
    nouTronc[i][j] = 'X';
    setTronc(nouTronc);
  } 
  */
  
  return (
    <div className='page'>

      <Link to="/crear-assaig"> <button>Crear assaig</button> </Link>
      <Link to="/crear-diada"> <button>Crear diada</button> </Link>
      <div className="separador" style={{height: '20px'}}></div>

      {/* 
      <h1>Tronc</h1>

      <table className='tronc'>
        <tbody>
          {tronc.map((fila, index) => (
            <tr key={index}>
              {fila.map((cela, index) => (
                <td className='cela' key={index}>{cela}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={() => canviaTronc(1,1)}>Canvia tronc</button>
      */}

    <h1>CALENDARI</h1>

    <iframe 
      src="https://calendar.google.com/calendar/embed?src=5e80ea51ac6c553da920f7c80d620cc582da641da13b6d16c54225f674348d25%40group.calendar.google.com&ctz=Europe%2FMadrid" 
      title="Calendari Passerells"
      style={{ border: 0 }} 
      width="800" 
      height="600" 
    ></iframe>

    </div>
  )
}

export default Main;