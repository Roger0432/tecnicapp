import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function Registre() { 
  const [nom, setNom] = useState('');
  const [cognoms, setCognoms] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repetirpassword, setRepetirpassword] = useState('');
  const [rol, setRol] = useState('');
  const [codiactivacio, setCodiactivacio] = useState('');
  const [error, setError] = useState('');
  const [rols, setRols] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authtoken');
    if (token) {
      navigate('/main');
    }
  }, [navigate]);

  useEffect(() => {
    const buscarRols = async () => {
      fetch(`${BACKEND_URL}/rols`)
        .then(response => response.json())
        .then(data => {
          if (data.status) {
            setRols(data.rols);
          } else {
            console.error('Error fetching roles:', data.msg);
          }
        })
        .catch(error => console.error('Error:', error));
    };
    buscarRols();
  }, []);

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

    if (nom === '' || cognoms === '' || email === '' || password === '' || repetirpassword === '' || rol === '0' || codiactivacio === '') {
      setError("Has d'omplir tots els camps");
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

    fetch(`${BACKEND_URL}/registre`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(data => {
        if (data.status) {
          const token = data.authtoken;
          localStorage.setItem('email', email);
          localStorage.setItem('authtoken', token);
          navigate('/main');
        } else {
          localStorage.clear();
          setError(data.msg || 'Error del servidor');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        setError('Error del servidor');
      });     
  }

  return (
    <div className='page'>
      <h2>REGISTRE</h2>
      <form id="register-form" onSubmit={handleRegister}>
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
            <option value='' disabled>Selecciona un rol</option>
            {rols.map((role) => (
              <option key={role.id} value={role.id}>
                {role.rol}
              </option>
            ))}
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
        <button id="register-btn" type="submit">Registra't</button>
      </form>
      <Link to="/inicisessio">Ja tens compte? Inicia sessió aquí.</Link>
      <div className="error">{error}</div>
    </div>
  );
}

export default Registre;
