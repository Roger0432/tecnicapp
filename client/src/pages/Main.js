import React from 'react'
import '../styles/App.css'
import { Link } from 'react-router-dom';

function Main () {
  return (
    <div className='page'>

      <Link to="/crear-assaig"> <button>Crear assaig</button> </Link>
      <Link to="/crear-diada"> <button>Crear diada</button> </Link>
    </div>
  )
}

export default Main;