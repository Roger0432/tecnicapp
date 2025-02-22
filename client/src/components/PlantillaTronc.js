import React, { useEffect, useState, useCallback } from 'react';
import '../styles/Tronc.css';

const PlantillaTronc = ({ files, columnes, agulla, castellersTronc }) => {

  const [taulaTronc, setTaulaTronc] = useState([]);

  const getCastellerPosicio = useCallback((key) => {
    let mote = '';
    for (let i = 0; i < castellersTronc.length; i++) {
      if (castellersTronc[i].posicio === key) {
        mote = castellersTronc[i].mote;
        break;
      }
    }
    return mote;
  }, [castellersTronc]);

  const crearCanalla = useCallback((taula) => {
    const enxanetaRow = [];
    const acotxadorRow = [];
    const dososRow = [];

    const key_enxaneta1 = 'enxaneta1';
    const key_acotxador1 = 'acotxador1';
    const key_acotxador2 = 'acotxador2';
    const key_dosos1 = 'dosos1';
    const key_dosos2 = 'dosos2';
    const key_dosos3 = 'dosos3';
    const key_dosos4 = 'dosos4';

    switch (columnes) {
      case 1:
        enxanetaRow.push(<td className='cela' key={key_enxaneta1}>{getCastellerPosicio(key_enxaneta1)}</td>);
        taula.push(<tr key='enxaneta-row'>{enxanetaRow}</tr>);

        acotxadorRow.push(<td className='cela' key={key_acotxador1}>{getCastellerPosicio(key_acotxador1)}</td>);
        taula.push(<tr key='acotxador-row'>{acotxadorRow}</tr>);
        break;

      case 2:
        enxanetaRow.push(<td key='empty-1-1'></td>);
        enxanetaRow.push(<td className='cela' key={key_enxaneta1}>{getCastellerPosicio(key_enxaneta1)}</td>);
        taula.push(<tr key='enxaneta-row'>{enxanetaRow}</tr>);

        acotxadorRow.push(<td className='cela' key={key_acotxador1}>{getCastellerPosicio(key_acotxador1)}</td>);
        acotxadorRow.push(<td key='empty-2-1'></td>);
        taula.push(<tr key='acotxador-row'>{acotxadorRow}</tr>);

        dososRow.push(<td className='cela' key={key_dosos1}>{getCastellerPosicio(key_dosos1)}</td>);
        dososRow.push(<td className='cela' key={key_dosos2}>{getCastellerPosicio(key_dosos2)}</td>);
        taula.push(<tr key='dosos-row'>{dososRow}</tr>);
        break;

      case 3:
        enxanetaRow.push(<td key='empty-3-1'></td>);
        enxanetaRow.push(<td className='cela' key={key_enxaneta1}>{getCastellerPosicio(key_enxaneta1)}</td>);
        enxanetaRow.push(<td key='empty-3-2'></td>);
        taula.push(<tr key='enxaneta-row'>{enxanetaRow}</tr>);

        acotxadorRow.push(<td key='empty-3-3'></td>);
        acotxadorRow.push(<td key='empty-3-4'></td>);
        acotxadorRow.push(<td className='cela' key={key_acotxador1}>{getCastellerPosicio(key_acotxador1)}</td>);
        taula.push(<tr key='acotxador-row'>{acotxadorRow}</tr>);

        dososRow.push(<td className='cela' key={key_dosos1}>{getCastellerPosicio(key_dosos1)}</td>);
        dososRow.push(<td className='cela' key={key_dosos2}>{getCastellerPosicio(key_dosos2)}</td>);
        dososRow.push(<td key='empty-3-5'></td>);
        taula.push(<tr key='dosos-row'>{dososRow}</tr>);
        break;

      case 4:
        enxanetaRow.push(<td key='empty-4-1'></td>);
        enxanetaRow.push(<td className='cela' key={key_enxaneta1}>{getCastellerPosicio(key_enxaneta1)}</td>);
        enxanetaRow.push(<td key='empty-4-2'></td>);
        enxanetaRow.push(<td key='empty-4-3'></td>);
        taula.push(<tr key='enxaneta-row'>{enxanetaRow}</tr>);

        acotxadorRow.push(<td key='empty-4-4'></td>);
        acotxadorRow.push(<td key='empty-4-5'></td>);
        acotxadorRow.push(<td key='empty-4-6'></td>);
        acotxadorRow.push(<td className='cela' key={key_acotxador1}>{getCastellerPosicio(key_acotxador1)}</td>);
        taula.push(<tr key='acotxador-row'>{acotxadorRow}</tr>);

        dososRow.push(<td className='cela' key={key_dosos1}>{getCastellerPosicio(key_dosos1)}</td>);
        dososRow.push(<td key='empty-4-7'></td>);
        dososRow.push(<td className='cela' key={key_dosos2}>{getCastellerPosicio(key_dosos2)}</td>);
        dososRow.push(<td key='empty-4-8'></td>);
        taula.push(<tr key='dosos-row'>{dososRow}</tr>);
        break;

      case 5:
        enxanetaRow.push(<td key='empty-5-1'></td>);
        enxanetaRow.push(<td className='cela' key={key_enxaneta1}>{getCastellerPosicio(key_enxaneta1)}</td>);
        enxanetaRow.push(<td key='empty-5-2'></td>);
        enxanetaRow.push(<td key='empty-5-3'></td>);
        enxanetaRow.push(<td key='empty-5-4'></td>);
        taula.push(<tr key='enxaneta-row'>{enxanetaRow}</tr>);

        acotxadorRow.push(<td key='empty-5-5'></td>);
        acotxadorRow.push(<td key='empty-5-6'></td>);
        acotxadorRow.push(<td className='cela' key={key_acotxador1}>{getCastellerPosicio(key_acotxador1)}</td>);
        acotxadorRow.push(<td key='empty-5-7'></td>);
        acotxadorRow.push(<td className='cela' key={key_acotxador2}>{getCastellerPosicio(key_acotxador2)}</td>);
        taula.push(<tr key='acotxador-row'>{acotxadorRow}</tr>);

        dososRow.push(<td className='cela' key={key_dosos1}>{getCastellerPosicio(key_dosos1)}</td>);
        dososRow.push(<td className='cela' key={key_dosos2}>{getCastellerPosicio(key_dosos2)}</td>);
        dososRow.push(<td key='empty-5-8'></td>);
        dososRow.push(<td className='cela' key={key_dosos3}>{getCastellerPosicio(key_dosos3)}</td>);
        dososRow.push(<td className='cela' key={key_dosos4}>{getCastellerPosicio(key_dosos4)}</td>);
        taula.push(<tr key='dosos-row'>{dososRow}</tr>);
        break;

      default:
        break;
    }
  }, [columnes, getCastellerPosicio]);

  const crearTronc = useCallback((taula) => {
    let novesFiles = files;
    if (columnes === 1) { // pilar
      novesFiles += 1;
    }

    for (let i = 0; i < novesFiles; i++) {
      const row = [];
      for (let j = 0; j < columnes; j++) {
        const key_tronc = `tronc-${i}-${j}`;
        row.push(<td className='cela' key={key_tronc}>{getCastellerPosicio(key_tronc)}</td>);
      }

      if (agulla) {
        const key_agulla = `agulla-${i}`;
        row.push(<td className='cela agulla' key={key_agulla}>{getCastellerPosicio(key_agulla)}</td>);
      }

      taula.push(<tr key={`tronc-row-${i}`}>{row}</tr>);
    }
  }, [files, columnes, agulla, getCastellerPosicio]);

  const crearBaixos = useCallback((taula) => {
    const baixos = [];
    let col = columnes;
    if (agulla) col += 1;
    for (let i = 0; i < col; i++) {
      const key_baixos = `baix-${i}`;
      baixos.push(<td className='cela baix' key={key_baixos}>{getCastellerPosicio(key_baixos)}</td>);
    }
    taula.push(<tr key='baixos-row'>{baixos}</tr>);
  }, [columnes, agulla, getCastellerPosicio]);

  const crearTaula = useCallback(() => {
    const taula = [];
    crearCanalla(taula);
    crearTronc(taula);
    crearBaixos(taula);
    setTaulaTronc(taula);
  }, [crearCanalla, crearTronc, crearBaixos]);

  useEffect(() => {
    crearTaula();
  }, [crearTaula]);
  
  return (
    <div>
      <table className='tronc'>
        <tbody>
          {taulaTronc}
        </tbody>
      </table>
    </div>
  );
};

export default PlantillaTronc;