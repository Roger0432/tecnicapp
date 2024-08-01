import React, { useEffect } from 'react';
import '../styles/Tronc.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const PlantillaTronc = ({ id, files, columnes, agulla }) => {

  const [pinya, setPinya] = React.useState([]);

  useEffect(() => {
    fetch(`${BACKEND_URL}/tronc/${id}`)
      .then(response => response.json())
      .then(data => {
        if (data.status) {
          setPinya(data.castellers);
        } else {
          console.error(data.msg);
        }
      })
      .catch(error => console.error('Error:', error));
  }, [id]);

  const getCastellerByPosition = (position) => {
    const casteller = pinya.find(c => c.posicio === position);
    return casteller ? casteller.mote : '';
  };

  const carregarTaula = () => {
    const table = [];

    carregarCanalla(table);
    carregarTronc(table);
    carregarBaixos(table);

    return table;
  };

  const carregarCanalla = (table) => {
    const enxaneta = [];
    const acotxador = [];
    const dosos = [];

    switch (columnes) {
      case 1:
        enxaneta.push(<td className='cela' key='enxaneta'>{getCastellerByPosition('enxaneta')}</td>);
        table.push(<tr key='enxaneta-row'>{enxaneta}</tr>);

        acotxador.push(<td className='cela' key='acotxador'>{getCastellerByPosition('acotxador')}</td>);
        table.push(<tr key='acotxador-row'>{acotxador}</tr>);
        break;

      case 2:
        enxaneta.push(<td key='empty-1-1'></td>);
        enxaneta.push(<td className='cela' key='enxaneta'>{getCastellerByPosition('enxaneta')}</td>);
        table.push(<tr key='enxaneta-row'>{enxaneta}</tr>);

        acotxador.push(<td className='cela' key='acotxador'>{getCastellerByPosition('acotxador')}</td>);
        acotxador.push(<td key='empty-2-1'></td>);
        table.push(<tr key='acotxador-row'>{acotxador}</tr>);

        dosos.push(<td className='cela' key='dosos1'>{getCastellerByPosition('dosos1')}</td>);
        dosos.push(<td className='cela' key='dosos2'>{getCastellerByPosition('dosos2')}</td>);
        table.push(<tr key='dosos-row'>{dosos}</tr>);
        break;

      case 3:
        enxaneta.push(<td key='empty-3-1'></td>);
        enxaneta.push(<td className='cela' key='enxaneta'>{getCastellerByPosition('enxaneta')}</td>);
        enxaneta.push(<td key='empty-3-2'></td>);
        table.push(<tr key='enxaneta-row'>{enxaneta}</tr>);

        acotxador.push(<td key='empty-3-3'></td>);
        acotxador.push(<td key='empty-3-4'></td>);
        acotxador.push(<td className='cela' key='acotxador'>{getCastellerByPosition('acotxador')}</td>);
        table.push(<tr key='acotxador-row'>{acotxador}</tr>);

        dosos.push(<td className='cela' key='dosos1'>{getCastellerByPosition('dosos1')}</td>);
        dosos.push(<td className='cela' key='dosos2'>{getCastellerByPosition('dosos2')}</td>);
        dosos.push(<td key='empty-3-5'></td>);
        table.push(<tr key='dosos-row'>{dosos}</tr>);
        break;

      case 4:
        enxaneta.push(<td key='empty-4-1'></td>);
        enxaneta.push(<td className='cela' key='enxaneta'>{getCastellerByPosition('enxaneta')}</td>);
        enxaneta.push(<td key='empty-4-2'></td>);
        enxaneta.push(<td key='empty-4-3'></td>);
        table.push(<tr key='enxaneta-row'>{enxaneta}</tr>);

        acotxador.push(<td key='empty-4-4'></td>);
        acotxador.push(<td key='empty-4-5'></td>);
        acotxador.push(<td key='empty-4-6'></td>);
        acotxador.push(<td className='cela' key='acotxador'>{getCastellerByPosition('acotxador')}</td>);
        table.push(<tr key='acotxador-row'>{acotxador}</tr>);

        dosos.push(<td className='cela' key='dosos1'>{getCastellerByPosition('dosos1')}</td>);
        dosos.push(<td key='empty-4-7'></td>);
        dosos.push(<td className='cela' key='dosos2'>{getCastellerByPosition('dosos2')}</td>);
        dosos.push(<td key='empty-4-8'></td>);
        table.push(<tr key='dosos-row'>{dosos}</tr>);
        break;

      case 5:
        enxaneta.push(<td key='empty-5-1'></td>);
        enxaneta.push(<td className='cela' key='enxaneta'>{getCastellerByPosition('enxaneta')}</td>);
        enxaneta.push(<td key='empty-5-2'></td>);
        enxaneta.push(<td key='empty-5-3'></td>);
        enxaneta.push(<td key='empty-5-4'></td>);
        table.push(<tr key='enxaneta-row'>{enxaneta}</tr>);

        acotxador.push(<td key='empty-5-5'></td>);
        acotxador.push(<td key='empty-5-6'></td>);
        acotxador.push(<td className='cela' key='acotxador1'>{getCastellerByPosition('acotxador1')}</td>);
        acotxador.push(<td key='empty-5-7'></td>);
        acotxador.push(<td className='cela' key='acotxador2'>{getCastellerByPosition('acotxador2')}</td>);
        table.push(<tr key='acotxador-row'>{acotxador}</tr>);

        dosos.push(<td className='cela' key='dosos1'>{getCastellerByPosition('dosos1')}</td>);
        dosos.push(<td className='cela' key='dosos2'>{getCastellerByPosition('dosos2')}</td>);
        dosos.push(<td key='empty-5-8'></td>);
        dosos.push(<td className='cela' key='dosos3'>{getCastellerByPosition('dosos3')}</td>);
        dosos.push(<td className='cela' key='dosos4'>{getCastellerByPosition('dosos4')}</td>);
        table.push(<tr key='dosos-row'>{dosos}</tr>);
        break;

      default:
        break;
    }
  };

  const carregarTronc = (table) => {
    if (columnes === 1) { // pilar
      files += 1;
    }

    for (let i = 0; i < files; i++) {
      const row = [];
      for (let j = 0; j < columnes; j++) {
        const key_tronc = `tronc-${i}-${j}`;
        row.push(<td className='cela' key={key_tronc}>{getCastellerByPosition(key_tronc)}</td>);
      }

      if (agulla) {
        const key_agulla = `agulla-${i}`;
        row.push(<td className='cela agulla' key={key_agulla}>{getCastellerByPosition(key_agulla)}</td>);
      }

      table.push(<tr key={`tronc-row-${i}`}>{row}</tr>);
    }
  };

  const carregarBaixos = (table) => {
    const baixos = [];
    let col = columnes;
    if (agulla) col += 1;
    for (let i = 0; i < col; i++) {
      const key_baixos = `baix-${i}`;
      baixos.push(<td className='cela baix' key={key_baixos}>{getCastellerByPosition(key_baixos)}</td>);
    }
    table.push(<tr key='baixos-row'>{baixos}</tr>);
  };

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
