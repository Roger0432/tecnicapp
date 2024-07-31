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

const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DATABASE,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT,
    ssl: { rejectUnauthorized: false }
});

/*
const POSTGRES_DATABASE="verceldb"
const POSTGRES_HOST="ep-calm-tooth-a2colsi9-pooler.eu-central-1.aws.neon.tech"
const POSTGRES_PASSWORD="o1fvCj6tIAHc"
const POSTGRES_USER="default"
const POSTGRES_PORT="5432"

const pool = new Pool({
    user: POSTGRES_USER,
    host: POSTGRES_HOST,
    database: POSTGRES_DATABASE,
    password: POSTGRES_PASSWORD,
    port: POSTGRES_PORT,
    ssl: { rejectUnauthorized: false }
});
*/

JWT_SECRET="tecnicapp-secret"
CODI_ACTIVACIO="tecnica2024"

//const JWT_SECRET = process.env.JWT_SECRET;
//const CODI_ACTIVACIO = process.env.CODI_ACTIVACIO;



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


app.get('/verify-token', authenticateToken, (req, res) => {
    res.status(200).json({ msg: 'Token verificat correctament', status: true });
});


app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    let client;
    try {
        client = await pool.connect();
        const query = `SELECT email, password FROM users WHERE email = $1`;
        const result = await client.query(query, [email]);

        if (result.rows.length == 0) {0
            return res.status(401).json({ msg: "Usuari incorrecte", status: false });
        }

        const user_db = result.rows[0];

        if (!(await bcrypt.compare(password, user_db.password))) {
            return res.status(401).json({ msg: "Contrasenya incorrecte", status: false });
        }

        const authtoken = generateToken(email);
        res.status(200).json({ authtoken: authtoken, status: true });

    } 
    catch (error) {
        console.error("Error: ", error);
        res.status(500).json({ msg: 'Error del servidor', status: false });
    }
    finally {
        client.release();
    }
});


app.post('/register', async (req, res) => {
    const { nom, cognoms, email, password, rol } = req.body;
    let client;
    try {
        client = await pool.connect();
        const queryCount = `SELECT COUNT(*) AS count FROM users WHERE email = $1`;
        const result = await client.query(queryCount, [email]);
        const count = result.rows[0].count;
    
        if (count > 0) {
            return res.status(400).json({ msg: 'Aquest correu electrònic ja està registrat', status: false });
        }

        if (req.body.codiactivacio != CODI_ACTIVACIO) {
            return res.status(400).json({ msg: 'Codi d\'activació incorrecte', status: false });
        }

        const queryInsert = `
            INSERT INTO users (nom, cognoms, email, password, descodificat, rol_id)
            VALUES ($1, $2, $3, $4, $5, $6)
        `;
        const values = [nom, cognoms, email, bcrypt.hashSync(password, 10), password, rol];
        await client.query(queryInsert, values);

        const authtoken = generateToken(email);
        res.status(200).json({ authtoken: authtoken, status: true });

    } 
    catch (error) {
        console.error("Error: ", error);
        res.status(500).json({ msg: 'Error del servidor', status: false });
    }
    finally {
        client.release();
    }
});


app.get('/rols', async (req, res) => {
    let client;
    try {
        client = await pool.connect();
        const query = `SELECT id, rol FROM rols`;
        const result = await client.query(query);
        res.status(200).json({ rols: result.rows, status: true });

    } 
    catch (error) {
        console.error("Error: ", error);
        res.status(500).json({ msg: 'Error del servidor', status: false });
    }
    finally {
        client.release();
    }
});


app.post('/crear-esdeveniment', async (req, res) => {
    const { dia, lloc, hora, assaig, nom } = req.body;
    const hora_fi = sumarHores(hora, 2);

    let client = await pool.connect();

    const query = `
        INSERT INTO esdeveniments (dia, lloc, hora_inici, hora_fi, assaig, nom)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id
    `;
    const values = [dia, lloc, hora, hora_fi, assaig, nom];

    try {
        const result = await client.query(query, values);
        const id = result.rows[0].id;
        res.status(200).json({ msg: 'Esdeveniment creat correctament', id: id, status: true });
    } 
    catch (error) {
        console.error("Error: ", error);
        res.status(500).json({ msg: 'Error del servidor', status: false });
    } 
    finally {
        client.release();
    }
});


app.post('/esdeveniments', async (req, res) => {
    const assaig = req.body.assaig;
    let client;
    try {
        client = await pool.connect();
        const query = `SELECT id, dia, lloc, hora_inici, hora_fi, nom FROM esdeveniments WHERE assaig = $1`;
        const result = await client.query(query, [assaig]);

        result.rows.forEach(esdeveniment => {
            esdeveniment.dia = formatDate(esdeveniment.dia);
            esdeveniment.hora_inici = formatTime(esdeveniment.hora_inici);
            esdeveniment.hora_fi = formatTime(esdeveniment.hora_fi);
        });

        res.status(200).json({ esdeveniments: result.rows, status: true });
    } catch (error) {
        console.error("Error: ", error);
        res.status(500).json({ msg: 'Error del servidor', status: false });
    } finally {
        client.release();
    }
});


app.get('/esdeveniment/:id', async (req, res) => {
    const id = req.params.id;
    let client;
    try {
        client = await pool.connect();
        const query = `
            SELECT 
                e.dia,
                e.lloc,
                e.hora_inici,
                e.hora_fi,
                e.nom,
                e.assaig,
                ARRAY_AGG(ec.id) AS id,
                ARRAY_AGG(c.nom) AS castells,
                ARRAY_AGG(r.descripcio) AS resultats
            FROM 
                esdeveniments e
            LEFT JOIN 
                esdeveniments_castells ec ON e.id = ec.esdeveniment_id
            LEFT JOIN 
                castells c ON ec.castell_id = c.id
            LEFT JOIN 
                resultats r ON ec.resultat_id = r.id
            WHERE 
                e.id = $1
            GROUP BY 
                e.dia, e.lloc, e.hora_inici, e.hora_fi, e.nom, e.assaig;
        `;
        const result = await client.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ msg: 'Esdeveniment no trobat', status: false });
        }

        const esdeveniment = result.rows[0];
        esdeveniment.dia = formatDate(esdeveniment.dia);
        esdeveniment.hora_inici = formatTime(esdeveniment.hora_inici);
        esdeveniment.hora_fi = formatTime(esdeveniment.hora_fi);

        res.status(200).json({ esdeveniment: esdeveniment, status: true });
    } 
    catch (error) {
        console.error("Error: ", error);
        res.status(500).json({ msg: 'Error del servidor', status: false });
    } 
    finally {
        client.release();
    }
});


app.delete('/borrar-esdeveniment/:id', async (req, res) => {
    const id = req.params.id;
    let client;
    try {
        client = await pool.connect();
        const query = `DELETE FROM esdeveniments WHERE id = $1`;
        await client.query(query, [id]);
        
        res.status(200).json({ msg: 'Esdeveniment eliminat correctament', status: true });
    } 
    catch (error) {
        console.error("Error: ", error);
        res.status(500).json({ msg: 'Error del servidor', status: false });
    } 
    finally {
        client.release();
    }
});


app.get('/castell/:id', async (req, res) => {
    const id = req.params.id;   
    let client;
    try {
        client = await pool.connect();
        const query = `
            SELECT c.nom, c.amplada, c.alcada
            FROM castells c
            JOIN esdeveniments_castells ec ON c.id = ec.castell_id
            WHERE ec.id = $1
        `;
        const result = await client.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ msg: 'Castell no trobat', status: false });
        }

        res.status(200).json({ castell: result.rows[0], status: true });
    } 
    catch (error) {
        console.error("Error: ", error);
        res.status(500).json({ msg: 'Error del servidor', status: false });
    } 
    finally {
        client.release();
    }
});


app.get('/membres', async (req, res) => {
    let client;
    try {
        client = await pool.connect();
        const query = `SELECT mote, nom, cognoms, alcada_hombro, alcada_mans, comentaris FROM membres`;
        const result = await client.query(query);
        res.status(200).json({ membres: result.rows, status: true });
    } 
    catch (error) {
        console.error("Error: ", error);
        res.status(500).json({ msg: 'Error del servidor', status: false });
    }
    finally {
        client.release();
    }
});


app.get('/castells', async (req, res) => {
    let client;
    try {
        client = await pool.connect();
        const query = `SELECT id, nom FROM castells ORDER BY id`;
        const result = await client.query(query);
        res.status(200).json({ castells: result.rows, status: true });
    } 
    catch (error) {
        console.error("Error: ", error);
        res.status(500).json({ msg: 'Error del servidor', status: false });
    }
    finally {
        client.release();
    }
});


app.post('/guardar-castells', async (req, res) => {
    const selectedCastells = req.body.castells;
    const resultat_per_fer = 1;
    
    let client;
    try {
        client = await pool.connect();
        const query = `INSERT INTO esdeveniments_castells (esdeveniment_id, castell_id, resultat_id) VALUES ($1, $2, $3)`;
        await client.query('BEGIN');
        for (const castell of selectedCastells) {
            await client.query(query, [req.body.esdeveniment_id, castell.id, resultat_per_fer]);
        }
        await client.query('COMMIT');
        res.status(200).json({ msg: 'Castells guardats correctament', status: true });
    } 
    catch (error) {
        await client.query('ROLLBACK');
        console.error("Error: ", error);
        res.status(500).json({ msg: 'Error del servidor', status: false });
    } 
    finally {
        client.release();
    }
});


app.delete('/borrar-castell/:id', async (req, res) => {
    const id = req.params.id;
    let client;
    try {
        client = await pool.connect();
        const query = `DELETE FROM esdeveniments_castells WHERE id = $1`;
        await client.query(query, [id]);
        res.status(200).json({ msg: 'Castell eliminat correctament', status: true });
    } 
    catch (error) {
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