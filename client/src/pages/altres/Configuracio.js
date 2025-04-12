import React, { useEffect } from 'react';
import { useTitol } from '../../context/TitolNavbar';

function Configuracio () {

  const { setTitol } = useTitol();

  useEffect(() => {
    setTitol('Configuració');
  }
  , [setTitol]);

  return (
    <div className='page'>Configuració</div>
  )
}

export default Configuracio;