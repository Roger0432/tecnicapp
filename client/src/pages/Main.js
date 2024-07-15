import React from 'react'
import '../styles/App.css'
import { Link } from 'react-router-dom';

function Main () {
  return (
    <div className='page'>

      <Link to="/crear-assaig"> <button>Crear Assaig</button> </Link>
      {/*<Link to="/diades"> <button>Crear diades</button> </Link>*/}

    </div>
  )
}

export default Main;