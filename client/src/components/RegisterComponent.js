import React from 'react'

export const RegisterComponent = ({ canviarMostrarLogin }) => { 
    return (
        <div>

            <h2>REGISTRE</h2>
            <div className="form-group">
                <label htmlFor="nom">Nom</label>
                <input type="text" id="nom" name="nom" placeholder="Nom" autoComplete="given-name" />
            </div>

            <div className="form-group">
                <label htmlFor="cognoms">Cognoms</label>
                <input type="text" id="cognoms" name="cognoms" placeholder="Cognoms" autoComplete="family-name" />
            </div>

            <div className="form-group">
                <label htmlFor="email">Correu electrònic</label>
                <input type="text" id="email" name="email" placeholder="Correu electrònic" autoComplete="email" />
            </div>

            <div className="form-group">
                <label htmlFor="roltecnica">Rol a tècnica</label>
                <select id="roltecnica" name="roltecnica" defaultValue={"cap"} autoComplete="off">
                    <option value="cap" disabled>Selecciona un rol</option>
                    <option value="capdecolla">Cap de colla</option>
                    <option value="sotscapdecolla">Sots cap de colla</option>
                    <option value="capdetroncs">Cap de troncs</option>
                    <option value="capdecanalla">Cap de canalla</option>
                    <option value="capdepinyes">Cap de pinyes</option>
                    <option value="capdebaixos">Cap de baixos</option>
                    <option value="capdecrosses">Cap de crosses</option>
                    <option value="equipdetroncs">Equip de troncs</option>
                    <option value="equipdecanalla">Equip de canalla</option>
                    <option value="equipdepinyes">Equip de pinyes</option>
                    <option value="equipdebaixos">Equip de baixos</option>
                    <option value="equipdecrosses">Equip de crosses</option>
                    <option value="altres">Altres</option>
                </select>
            </div>

            <div className="form-group">
                <label htmlFor="password">Contrasenya</label>
                <input type="password" id="password" name="password" placeholder="Contrasenya" autoComplete="new-password" />
            </div>

            <div className="form-group">
                <label htmlFor="repetirpassword">Repetir contrasenya</label>
                <input type="password" id="repetirpassword" name="repetirpassword" placeholder="Repetir contrasenya" autoComplete="new-password" />
            </div>

            <div className="form-group">
                <label htmlFor="codiactivacio">Codi d'activació</label>
                <input type="text" id="codiactivacio" name="codiactivacio" placeholder="Codi d'activació" autoComplete="one-time-code" />
            </div>

            <button>Registrar-se</button>
            <br></br>
            <a href="#login" onClick={ canviarMostrarLogin }>Ja tens compte? Inicia sessió aquí.</a>

        </div>
    )
}

export default RegisterComponent;