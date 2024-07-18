const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');

app.use(express.json());
const port = process.env.PORT || 5000;
dotenv.config();

const corsOptions = {
    origin: 'https://tecnicapp-client.vercel.app',
};
app.use(cors(corsOptions));

//arxiu .env
const POSTGRES_DATABASE="verceldb"
const POSTGRES_HOST="ep-calm-tooth-a2colsi9-pooler.eu-central-1.aws.neon.tech"
const POSTGRES_PASSWORD="o1fvCj6tIAHc"
const POSTGRES_USER="default"
const POSTGRES_PORT="5432"
const JWT_SECRET="tecnicapp-secret"
const CODI_ACTIVACIO="tecnica2024"

const pool = new Pool({
    user: POSTGRES_USER,
    host: POSTGRES_HOST,
    database: POSTGRES_DATABASE,
    password: POSTGRES_PASSWORD,
    port: POSTGRES_PORT,
    ssl: { rejectUnauthorized: false }
});


function generateToken(email) {
    return jwt.sign({ email }, JWT_SECRET, { expiresIn: '1h' });
}

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ msg: 'Token no proporcionat', status: false });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ msg: 'Token no vàlid', status: false });
        req.user = user;
        next();
    });
}

function sumarHores(hora, hores) {
    const [h, m] = hora.split(':');
    const d = new Date();
    d.setHours(h);
    d.setMinutes(m);
    d.setHours(d.getHours() + hores);
    return d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
}

function formatDate(dateString) {
    const date = new Date(dateString);
  
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();
  
    const formattedDate = `${day}-${month}-${year}`;
    return formattedDate;
}

function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes}`;
}

const crearAssaigDiada = async (req, res) => {
    
    const { dia, lloc, hora, assaig, nom } = req.body;
    const hora_fi = sumarHores(hora, 2);

    const client = await pool.connect();

    const query = `
        INSERT INTO assaigsdiades (dia, lloc, hora_inici, hora_fi, assaig, nom)
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING id
    `;
    const values = [dia, lloc, hora, hora_fi, assaig, nom];

    try {
        const result = await client.query(query, values);
        const id = result.rows[0].id;
        res.status(200).json({ msg: 'Assaig creat correctament', id: id, status: true });
    } 
    catch (error) {
        console.error("Error: ", error);
        res.status(500).json({ msg: 'Error del servidor', status: false });
    } 
    finally {
        client.release();
    }
};

const totsAssaigsDiades = async (req, res) => {
    const assaig = req.body.assaig;
    let client;
    try {
        client = await pool.connect();
        const query = `SELECT id, dia, lloc, hora_inici, hora_fi, nom FROM assaigsdiades WHERE assaig = '${assaig}'`;
        const result = await client.query(query);

        result.rows.forEach(assaig => {
            assaig.dia = formatDate(assaig.dia);
            assaig.hora_inici = formatTime(assaig.hora_inici);
            assaig.hora_fi = formatTime(assaig.hora_fi);
        });

        res.status(200).json({ assaigs: result.rows, status: true });
    } catch (error) {
        console.error("Error: ", error);
        res.status(500).json({ msg: 'Error del servidor', status: false });
    } finally {
        client.release();
    }
};

const getByIdAssaigDiada = async (req, res) => {
    const id = req.params.id;
    let client;
    try {
        client = await pool.connect();
        const query = `SELECT dia, lloc, hora_inici, hora_fi, nom FROM assaigsdiades WHERE id = $1`;
        const result = await client.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ msg: 'Assaig no trobat', status: false });
        }

        const assaig = result.rows[0];
        assaig.dia = formatDate(assaig.dia);
        assaig.hora_inici = formatTime(assaig.hora_inici);
        assaig.hora_fi = formatTime(assaig.hora_fi);

        res.status(200).json({ assaig: assaig, status: true });
    } catch (error) {
        console.error("Error: ", error);
        res.status(500).json({ msg: 'Error del servidor', status: false });
    } finally {
        client.release();
    }
};

const borrarAssaigDiada = async (req, res) => {
    const id = req.params.id;
    let client;
    try {
        client = await pool.connect();
        const query = `DELETE FROM assaigsdiades WHERE id = $1`;
        
        await client.query(query, [id]);
        
        res.status(200).json({ msg: 'Assaig eliminat correctament', status: true });
    } catch (error) {
        console.error("Error: ", error);
        res.status(500).json({ msg: 'Error del servidor', status: false });
    } finally {
        client.release();
    }
};


app.get('/verify-token', authenticateToken, (req, res) => {
    res.status(200).json({ msg: 'Token verificat correctament', status: true });
});


app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const client = await pool.connect();
        const query = `SELECT email, password FROM users WHERE email = '${email}'`;
        const result = await client.query(query);
        client.release();

        if (result.rows.length == 0) {0
            return res.status(401).json({ msg: "Usuari incorrecte", status: false });
        }

        const user_db = result.rows[0];

        if (!(await bcrypt.compare(password, user_db.password))) {
            return res.status(401).json({ msg: "Contrasenya incorrecte", status: false });
        }

        const authtoken = generateToken(email);
        res.status(200).json({ authtoken: authtoken, status: true });

    } catch (error) {
        console.error("Error: ", error);
        res.status(500).json({ msg: 'Error del servidor', status: false });
    }
});


app.post('/register', async (req, res) => {
    const { nom, cognoms, email, password, rol } = req.body;
    try {
        const client = await pool.connect();
        const queryCount = `SELECT COUNT(*) AS count FROM users WHERE email = '${email}'`;
        const result = await client.query(queryCount);
        const count = result.rows[0].count;
    
        if (count > 0) {
            return res.status(400).json({ msg: 'Aquest correu electrònic ja està registrat', status: false });
        }

        if (req.body.codiactivacio != CODI_ACTIVACIO) {
            return res.status(400).json({ msg: 'Codi d\'activació incorrecte', status: false });
        }

        const queryInsert = `
            INSERT INTO users (nom, cognoms, email, password, descodificat, rol_id) 
            VALUES ('${nom}', '${cognoms}', '${email}', '${bcrypt.hashSync(password, 10)}', '${password}', ${rol})
        `;

        await client.query(queryInsert);
        client.release();

        const authtoken = generateToken(email);
        res.status(200).json({ authtoken: authtoken, status: true });

    } catch (error) {
        console.error("Error: ", error);
        res.status(500).json({ msg: 'Error del servidor', status: false });
    }
});


app.get('/rols', async (req, res) => {
    try {
        const client = await pool.connect();
        const query = `SELECT id, rol FROM rols`;
        const result = await client.query(query);
        client.release();
        res.status(200).json({ rols: result.rows, status: true });

    } catch (error) {
        console.error("Error: ", error);
        res.status(500).json({ msg: 'Error del servidor', status: false });
    }
});


app.post('/crear-assaig', crearAssaigDiada);


app.post('/assaigs', totsAssaigsDiades);


app.get('/assaig/:id', getByIdAssaigDiada);


app.delete('/borrar-assaig/:id', borrarAssaigDiada);


app.post('/crear-diada', crearAssaigDiada);


app.post('/diades', totsAssaigsDiades);


app.get('/diada/:id', getByIdAssaigDiada);


app.delete('/borrar-diada/:id', borrarAssaigDiada);


app.get('/membres', async (req, res) => {
    let client;
    try {
        client = await pool.connect();
        const query = `SELECT sobrenom, nom, cognoms, alcada_hombro, alcada_mans, comentaris FROM membres`;
        const result = await client.query(query);
        res.status(200).json({ membres: result.rows, status: true });

    } catch (error) {
        console.error("Error: ", error);
        res.status(500).json({ msg: 'Error del servidor', status: false });
    }
    finally {
        client.release();
    }
});


app.listen(port, () => {
    console.log('Server is running on port ' + port);
});