import React from 'react'

export const LoginComponent = ({ canviarMostrarLogin }) => {
  return (
    <div>

      <h2>LOGIN</h2>
      <label htmlFor="lg-email">Correu electrònic</label>
      <input type="text" id="lg-email" name="lg-email" placeholder="Correu electrònic" autoComplete="username" />
      <br></br>
      <label htmlFor="lg-password">Contrasenya</label>
      <input type="password" id="lg-password" name="lg-password" placeholder="Contrasenya" autoComplete="current-password" />
      <br></br>
      <button>Iniciar sessió</button>
      <br></br>
      <a href="#registre" onClick={canviarMostrarLogin}>No tens compte? Registra't aquí.</a>

    </div>
  )
}

export default LoginComponent;