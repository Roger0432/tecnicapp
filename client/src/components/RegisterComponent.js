import React, { useState } from 'react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
//const BACKEND_URL = "";

export const RegisterComponent = ({ canviarMostrarLogin }) => { 

    const [nom, setNom] = useState('');
    const [cognoms, setCognoms] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repetirpassword, setRepetirpassword] = useState('');
    const [rol, setRol] = useState('Selecciona un rol');
    const [codiactivacio, setCodiactivacio] = useState('');
    const [error, setError] = useState('');

    const handleNomChange = (event) => setNom(event.target.value);
    const handleCognomsChange = (event) => setCognoms(event.target.value);
    const handleEmailChange = (event) => setEmail(event.target.value);
    const handlePasswordChange = (event) => setPassword(event.target.value);
    const handleRepetirpasswordChange = (event) => setRepetirpassword(event.target.value);
    const handleCodiactivacioChange = (event) => setCodiactivacio(event.target.value);
    const handleRolChange = (event) => setRol(event.target.value);

    const handleRegister = async (event) => {
        event.preventDefault();
        setError('');

        if (nom === '' || cognoms === '' || email === '' || password === '' || repetirpassword === '' || rol === '' || codiactivacio === '') {
            setError('Has d\'omplir tots els camps');
            return;
        }

        if (password !== repetirpassword) {
            setError('Les contrasenyes no coincideixen');
            return;
        }

        if (password.length < 6) {
            setError('La contrasenya ha de tenir com a mínim 6 caràcters');
            return;
        }

        const data = { nom, cognoms, email, password, rol, codiactivacio };
    
        const response = await fetch(`${BACKEND_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const result = await response.json();
            setError(result.msg || 'Error del servidor');
            return;
        }

    }

        
    return (
        <div>

            <h2>REGISTRE</h2>
            <div className="form-group">
                <label htmlFor="nom">Nom</label>
                <input 
                    type="text"
                    id="nom"
                    name="nom" 
                    placeholder="Nom" 
                    autoComplete="given-name"
                    value={nom}
                    onChange={handleNomChange}
                />
            </div>

            <div className="form-group">
                <label htmlFor="cognoms">Cognoms</label>
                <input 
                    type="text"
                    id="cognoms" 
                    name="cognoms" 
                    placeholder="Cognoms" 
                    autoComplete="family-name" 
                    value={cognoms}
                    onChange={handleCognomsChange}
                />
            </div>

            <div className="form-group">
                <label htmlFor="email">Correu electrònic</label>
                <input 
                    type="text" 
                    id="email" 
                    name="email" 
                    placeholder="Correu electrònic" 
                    autoComplete="email" 
                    value={email}
                    onChange={handleEmailChange}
                />
            </div>

            <div className="form-group">
                <label htmlFor="roltecnica">Rol a tècnica</label>
                <select 
                    id="roltecnica" 
                    name="roltecnica" 
                    value={rol} 
                    onChange={handleRolChange} 
                    autoComplete="off">       

                    <option value="Selecciona un rol" disabled>Selecciona un rol</option>
                    <option value="Cap de colla">Cap de colla</option>
                    <option value="Sots cap de colla">Sots cap de colla</option>
                    <option value="Cap de troncs">Cap de troncs</option>
                    <option value="Cap de canalla">Cap de canalla</option>
                    <option value="Cap de pinyes">Cap de pinyes</option>
                    <option value="Cap de baixos">Cap de baixos</option>
                    <option value="Cap de crosses">Cap de crosses</option>
                    <option value="Equip de troncs">Equip de troncs</option>
                    <option value="Equip de canalla">Equip de canalla</option>
                    <option value="Equip de pinyes">Equip de pinyes</option>
                    <option value="Equip de baixos">Equip de baixos</option>
                    <option value="Equip de crosses">Equip de crosses</option>
                    <option value="Altres">Altres</option>
                </select>
            </div>

            <div className="form-group">
                <label htmlFor="password">Contrasenya</label>
                <input 
                    type="password" 
                    id="password" 
                    name="password" 
                    placeholder="Contrasenya" 
                    autoComplete="new-password" 
                    value={password}
                    onChange={handlePasswordChange}
                />
            </div>

            <div className="form-group">
                <label htmlFor="repetirpassword">Repetir contrasenya</label>
                <input 
                    type="password" 
                    id="repetirpassword" 
                    name="repetirpassword" 
                    placeholder="Repetir contrasenya" 
                    autoComplete="new-password"
                    value={repetirpassword}
                    onChange={handleRepetirpasswordChange}
                />
            </div>

            <div className="form-group">
                <label htmlFor="codiactivacio">Codi d'activació</label>
                <input 
                    type="text" 
                    id="codiactivacio" 
                    name="codiactivacio"
                    placeholder="Codi d'activació" 
                    autoComplete="one-time-code" 
                    value={codiactivacio}
                    onChange={handleCodiactivacioChange}
                />
            </div>

            <button id="register-btn" onClick={handleRegister}>Registrar-se</button>
            <br></br>
            <a href="#login" onClick={ canviarMostrarLogin }>Ja tens compte? Inicia sessió aquí.</a>
            <br></br>
            <div className="error">{error}</div>

        </div>
    )
}

export default RegisterComponent;