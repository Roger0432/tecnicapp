import React from 'react';
import '../styles/Tronc.css';

const PlantillaTronc = ({ files, columnes }) => {
  /*
  const table = [];

  const carregarTaula = () => {

    carregarCanalla();
    carregarTronc();

    return table;
  };

  const carregarCanalla = () => {

    const enxaneta = [];
    const acotxador = [];
    const dosos = [];

    switch (columnes) {

      case 1:
        enxaneta.push(<td className='cela' key={0}>Enxaneta</td>);
        table.push(<tr key={0}>{enxaneta}</tr>);

        acotxador.push(<td className='cela' key={0}>Acotxador</td>);
        table.push(<tr key={1}>{acotxador}</tr>);
        break;

      case 2:
        enxaneta.push(<td></td>);
        enxaneta.push(<td className='cela' key={0}>Enxaneta</td>);
        table.push(<tr key={0}>{enxaneta}</tr>);

        acotxador.push(<td className='cela' key={0}>Acotxador</td>);
        acotxador.push(<td></td>);
        table.push(<tr key={1}>{acotxador}</tr>);

        dosos.push(<td className='cela' key={0}>Dosos</td>);
        dosos.push(<td className='cela' key={0}>Dosos</td>);
        table.push(<tr key={2}>{dosos}</tr>);
        break;

      case 3:
        enxaneta.push(<td></td>);
        enxaneta.push(<td className='cela' key={0}>Enxaneta</td>);
        enxaneta.push(<td></td>);
        table.push(<tr key={0}>{enxaneta}</tr>);

        acotxador.push(<td></td>);
        acotxador.push(<td></td>);
        acotxador.push(<td className='cela' key={0}>Acotxador</td>);
        table.push(<tr key={1}>{acotxador}</tr>);

        dosos.push(<td className='cela' key={0}>Dosos</td>);
        dosos.push(<td className='cela' key={0}>Dosos</td>);
        dosos.push(<td></td>);
        table.push(<tr key={2}>{dosos}</tr>);
        break;

      case 4:
        enxaneta.push(<td></td>);
        enxaneta.push(<td className='cela' key={0}>Enxaneta</td>);
        enxaneta.push(<td></td>);
        enxaneta.push(<td></td>);
        table.push(<tr key={0}>{enxaneta}</tr>);

        acotxador.push(<td></td>);
        acotxador.push(<td></td>);
        acotxador.push(<td></td>);
        acotxador.push(<td className='cela' key={0}>Acotxador</td>);
        table.push(<tr key={1}>{acotxador}</tr>);

        dosos.push(<td className='cela' key={0}>Dosos</td>);
        dosos.push(<td></td>);
        dosos.push(<td className='cela' key={0}>Dosos</td>);
        dosos.push(<td></td>);
        table.push(<tr key={2}>{dosos}</tr>);
        break;

      case 5:
        enxaneta.push(<td></td>);
        enxaneta.push(<td className='cela' key={0}>Enxaneta</td>);
        enxaneta.push(<td></td>);
        enxaneta.push(<td></td>);
        enxaneta.push(<td></td>);
        table.push(<tr key={0}>{enxaneta}</tr>);

        acotxador.push(<td></td>);
        acotxador.push(<td></td>);
        acotxador.push(<td className='cela' key={0}>Acotxador</td>);        
        acotxador.push(<td></td>);
        acotxador.push(<td className='cela' key={0}>Acotxador</td>);
        table.push(<tr key={1}>{acotxador}</tr>);

        dosos.push(<td className='cela' key={0}>Dosos</td>);
        dosos.push(<td className='cela' key={0}>Dosos</td>);
        dosos.push(<td></td>);
        dosos.push(<td className='cela' key={0}>Dosos</td>);
        dosos.push(<td className='cela' key={0}>Dosos</td>);
        table.push(<tr key={2}>{dosos}</tr>);
        break;

      default:
        for (let i = 0; i < columnes; i++) {
          table.push(<td className='cela' key={i}>Canalla</td>);
        }
        break;
    }

  }

  const carregarTronc = () => {
    for (let i = 0; i < files; i++) {
      const row = [];     
      for (let j = 0; j < columnes; j++) {
        row.push(<td className='cela' key={j}>Tronc</td>);
      }
      table.push(<tr key={i}>{row}</tr>);
    }
  }
  */
  return (
    <div>
      <table className='tronc'>
        <tbody>
          
        </tbody>
      </table>
    </div>
  );
};

export default PlantillaTronc;
