import React from 'react';
import '../styles/Tronc.css';

const PlantillaTronc = ({ files, columnes }) => {

  const carregarTaula = () => {
    const table = [];

    carregarCanalla(table);
    carregarTronc(table);

    return table;
  };

  const carregarCanalla = (table) => {
    const enxaneta = [];
    const acotxador = [];
    const dosos = [];

    switch (columnes) {
      case 1:
        enxaneta.push(<td className='cela' key='enxaneta'>Enxaneta</td>);
        table.push(<tr key='enxaneta-row'>{enxaneta}</tr>);

        acotxador.push(<td className='cela' key='acotxador'>Acotxador</td>);
        table.push(<tr key='acotxador-row'>{acotxador}</tr>);
        break;

      case 2:
        enxaneta.push(<td key='enxaneta-empty1'></td>);
        enxaneta.push(<td className='cela' key='enxaneta'>Enxaneta</td>);
        table.push(<tr key='enxaneta-row'>{enxaneta}</tr>);

        acotxador.push(<td className='cela' key='acotxador'>Acotxador</td>);
        acotxador.push(<td key='acotxador-empty'></td>);
        table.push(<tr key='acotxador-row'>{acotxador}</tr>);

        dosos.push(<td className='cela' key='dosos1'>Dosos</td>);
        dosos.push(<td className='cela' key='dosos2'>Dosos</td>);
        table.push(<tr key='dosos-row'>{dosos}</tr>);
        break;

      case 3:
        enxaneta.push(<td key='enxaneta-empty1'></td>);
        enxaneta.push(<td className='cela' key='enxaneta'>Enxaneta</td>);
        enxaneta.push(<td key='enxaneta-empty2'></td>);
        table.push(<tr key='enxaneta-row'>{enxaneta}</tr>);

        acotxador.push(<td key='acotxador-empty1'></td>);
        acotxador.push(<td key='acotxador-empty2'></td>);
        acotxador.push(<td className='cela' key='acotxador'>Acotxador</td>);
        table.push(<tr key='acotxador-row'>{acotxador}</tr>);

        dosos.push(<td className='cela' key='dosos1'>Dosos</td>);
        dosos.push(<td className='cela' key='dosos2'>Dosos</td>);
        dosos.push(<td key='dosos-empty'></td>);
        table.push(<tr key='dosos-row'>{dosos}</tr>);
        break;

      case 4:
        enxaneta.push(<td key='enxaneta-empty1'></td>);
        enxaneta.push(<td className='cela' key='enxaneta'>Enxaneta</td>);
        enxaneta.push(<td key='enxaneta-empty2'></td>);
        enxaneta.push(<td key='enxaneta-empty3'></td>);
        table.push(<tr key='enxaneta-row'>{enxaneta}</tr>);

        acotxador.push(<td key='acotxador-empty1'></td>);
        acotxador.push(<td key='acotxador-empty2'></td>);
        acotxador.push(<td key='acotxador-empty3'></td>);
        acotxador.push(<td className='cela' key='acotxador'>Acotxador</td>);
        table.push(<tr key='acotxador-row'>{acotxador}</tr>);

        dosos.push(<td className='cela' key='dosos1'>Dosos</td>);
        dosos.push(<td key='dosos-empty1'></td>);
        dosos.push(<td className='cela' key='dosos2'>Dosos</td>);
        dosos.push(<td key='dosos-empty2'></td>);
        table.push(<tr key='dosos-row'>{dosos}</tr>);
        break;

      case 5:
        enxaneta.push(<td key='enxaneta-empty1'></td>);
        enxaneta.push(<td className='cela' key='enxaneta'>Enxaneta</td>);
        enxaneta.push(<td key='enxaneta-empty2'></td>);
        enxaneta.push(<td key='enxaneta-empty3'></td>);
        enxaneta.push(<td key='enxaneta-empty4'></td>);
        table.push(<tr key='enxaneta-row'>{enxaneta}</tr>);

        acotxador.push(<td key='acotxador-empty1'></td>);
        acotxador.push(<td key='acotxador-empty2'></td>);
        acotxador.push(<td className='cela' key='acotxador1'>Acotxador</td>);        
        acotxador.push(<td key='acotxador-empty3'></td>);
        acotxador.push(<td className='cela' key='acotxador2'>Acotxador</td>);
        table.push(<tr key='acotxador-row'>{acotxador}</tr>);

        dosos.push(<td className='cela' key='dosos1'>Dosos</td>);
        dosos.push(<td className='cela' key='dosos2'>Dosos</td>);
        dosos.push(<td key='dosos-empty1'></td>);
        dosos.push(<td className='cela' key='dosos3'>Dosos</td>);
        dosos.push(<td className='cela' key='dosos4'>Dosos</td>);
        table.push(<tr key='dosos-row'>{dosos}</tr>);
        break;

      default:
        const canallaRow = [];
        for (let i = 0; i < columnes; i++) {
          canallaRow.push(<td className='cela' key={`canalla-${i}`}>Canalla</td>);
        }
        table.push(<tr key='canalla-row'>{canallaRow}</tr>);
        break;
    }
  }

  const carregarTronc = (table) => {
    for (let i = 0; i < files; i++) {
      const row = [];
      for (let j = 0; j < columnes; j++) {
        row.push(<td className='cela' key={`tronc-${i}-${j}`}>Tronc</td>);
      }
      table.push(<tr key={`tronc-row-${i}`}>{row}</tr>);
    }
  }

  return (
    <div>
      <table className='tronc'>
        <tbody>
          {carregarTaula()}
        </tbody>
      </table>
    </div>
  );
};

export default PlantillaTronc;
