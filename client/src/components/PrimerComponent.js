import React, { useState } from 'react'

export const PrimerComponent = () => {

  let cursos = ['React', 'Angular', 'Vue']

  const [nom, setNom] = useState('Joan')

  const cambiarNom = (nouNom) => {
    setNom(nouNom);
  }

  return (
    <div>
      <h2>PrimerComponent</h2>
      <div>Hola {nom}</div>

      <input type="text" onChange={(e) => cambiarNom(e.target.value)} placeholder="Escriu el teu nom"/>

      <button onClick={() => cambiarNom("Roger")}>Canviar nom</button>

      <h3>Cursos</h3>
      <ul>
        {cursos.map((curs, index) => (
          <li key={index}>{curs}</li>
        ))}
      </ul>
      
    </div>
  )
}
