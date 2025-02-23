import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TextField, Button, Box, InputLabel, MenuItem, Select, FormControl } from '@mui/material';

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
      <form id="register-form" onSubmit={handleRegister}>
        <Box className="form-group" display="flex" flexDirection="column" gap={2}>
          <h2>REGISTRE</h2>
          <TextField 
            id="nom" 
            label="Nom" 
            type="text" 
            autoComplete="given-name" 
            value={nom}
            onChange={handleNomChange}
          />
          <TextField 
            id="cognoms" 
            label="Cognoms" 
            type="text" 
            autoComplete="family-name" 
            value={cognoms}
            onChange={handleCognomsChange}
          />
          <TextField 
            id="email" 
            label="Correu electrònic" 
            type="email" 
            autoComplete="email" 
            value={email}
            onChange={handleEmailChange}
          />
          <FormControl fullWidth>
            <InputLabel id="roltecnica-label">Rol a tècnica</InputLabel>
            <Select
              labelId="roltecnica-label"
              id="roltecnica"
              value={rol}
              onChange={handleRolChange}
              autoWidth
              label="Rol a tècnica"
            >
              {rols.map((role) => (
                <MenuItem key={role.id} value={role.id}>
                  {role.rol}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField 
            id="password" 
            label="Contrasenya" 
            type="password" 
            autoComplete="new-password" 
            value={password}
            onChange={handlePasswordChange}
          />
          <TextField 
            id="repetirpassword" 
            label="Repetir contrasenya" 
            type="password" 
            autoComplete="new-password"
            value={repetirpassword}
            onChange={handleRepetirpasswordChange}
          />
          <TextField 
            id="codiactivacio" 
            label="Codi d'activació" 
            type="text" 
            autoComplete="one-time-code" 
            value={codiactivacio}
            onChange={handleCodiactivacioChange}
          />
          <Button variant="contained" type="submit">Registra't</Button>
          <Button variant="text" component={Link} to="/inicisessio">Ja tens compte? Inicia sessió aquí.</Button>
          <div className="error">{error}</div>

        </Box>
      </form>
    </div>
  );
}

export default Registre;