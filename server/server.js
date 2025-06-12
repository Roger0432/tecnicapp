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
    origin: ['https://tecnicapp-client.vercel.app', 'http://localhost:3000'],
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

const CODI_ACTIVACIO = process.env.CODI_ACTIVACIO;
const JWT_SECRET="tecnicapp-secret"

function generateToken(email) {
    return jwt.sign({ email }, JWT_SECRET/*, { expiresIn: '24h' }*/);
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

app.use((req, res, next) => {
    if (!req.url.includes('/verify-token')) {
        console.log(`${req.method} ${req.url}`);
    }
    next();
});


// autenticacio


app.get('/verify-token', authenticateToken, (req, res) => {
    res.status(200).json({ msg: 'Token verificat correctament', status: true });
});


app.post('/inicisessio', async (req, res) => {
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


app.post('/registre', async (req, res) => {
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
            INSERT INTO users (nom, cognoms, email, password, rol_id)
            VALUES ($1, $2, $3, $4, $5, $6)
        `;
        const values = [nom, cognoms, email, bcrypt.hashSync(password, 10), rol];
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


app.post('/user', async (req, res) => {
    const email = req.body.email;
    let client;
    try {
        client = await pool.connect();
        const query = `
            SELECT u.nom, u.cognoms, u.email, r.rol
            FROM users u JOIN rols r ON u.rol_id = r.id 
            WHERE u.email = $1
        `;
        const result = await client.query(query, [email]);
        res.status(200).json({ dades: result.rows[0], status: true });
    } 
    catch (error) {
        console.error("Error: ", error);
        res.status(500).json({ msg: 'Error del servidor', status: false });
    } 
    finally {
        client.release();
    }
});


// esdeveniments


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
        let query;
        let result;
        
        if (assaig === undefined || assaig === null) {
            query = `SELECT id, dia, lloc, hora_inici, hora_fi, nom, assaig FROM esdeveniments ORDER BY dia ASC`;
            result = await client.query(query);
        } else {
            query = `SELECT id, dia, lloc, hora_inici, hora_fi, nom, assaig FROM esdeveniments WHERE assaig = $1 ORDER BY dia ASC`;
            result = await client.query(query, [assaig]);
        }

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


app.get('/detalls-esdeveniment/:id', async (req, res) => {
    const id = req.params.id;
    let client;
    try {
        client = await pool.connect();
        const query = `
            SELECT id, dia, lloc, hora_inici, hora_fi, nom
            FROM esdeveniments
            WHERE id = $1
        `;
        const result = await client.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ msg: 'Esdeveniment no trobat', status: false });
        }

        const detalls = result.rows[0];
        detalls.dia = formatDate(detalls.dia);
        detalls.hora_inici = formatTime(detalls.hora_inici);
        detalls.hora_fi = formatTime(detalls.hora_fi);

        res.status(200).json({ esdeveniment: detalls, status: true });
    } 
    catch (error) {
        console.error("Error: ", error);
        res.status(500).json({ msg: 'Error del servidor', status: false });
    } 
    finally {
        client.release();
    }
});


app.get('/castells-esdeveniment/:id', async (req, res) => {
    const id = req.params.id;
    let client;
    try {
        client = await pool.connect();
        const query = `
            SELECT ec.id, c.nom, ec.nom AS descripcio
            FROM esdeveniments_castells ec
            JOIN castells c ON ec.castell_id = c.id
            WHERE ec.esdeveniment_id = $1
        `;
        const result = await client.query(query, [id]);
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


app.post('/editar-descripcio-castell', async (req, res) => {
    const { id, descripcio } = req.body;
    let client;
    try {
        client = await pool.connect();
        const query = `UPDATE esdeveniments_castells SET nom = $1 WHERE id = $2`;
        await client.query(query, [descripcio, id]);
        res.status(200).json({ msg: 'Descripció actualitzada correctament', status: true });
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


app.put('/editar-esdeveniment/:id', async (req, res) => {
    const id = req.params.id;
    const { dia, lloc, hora, nom } = req.body;
    const hora_fi = sumarHores(hora, 2);  

    let client;
    try {
        client = await pool.connect();
        const query = `
            UPDATE esdeveniments 
            SET dia = $1, lloc = $2, hora_inici = $3, hora_fi = $4, nom = $5
            WHERE id = $6
        `;
        const values = [dia, lloc, hora, hora_fi, nom, id];
        await client.query(query, values);

        res.status(200).json({ msg: 'Esdeveniment actualitzat correctament', status: true });
    } 
    catch (error) {
        console.error("Error: ", error);
        res.status(500).json({ msg: 'Error del servidor', status: false });
    }
    finally {
        client.release();
    }
});


app.get('/proxims-esdeveniments', async (req, res) => {
    let client;
    try {
        client = await pool.connect();
        
        const queryAssaig = `
            SELECT id, dia, lloc, hora_inici, hora_fi, nom, assaig
            FROM esdeveniments
            WHERE dia >= CURRENT_DATE AND assaig = true
            LIMIT 1
        `;
        const resultAssaig = await client.query(queryAssaig);
        
        const queryDiada = `
            SELECT id, dia, lloc, hora_inici, hora_fi, nom, assaig
            FROM esdeveniments
            WHERE dia >= CURRENT_DATE AND assaig = false
            LIMIT 1
        `;
        const resultDiada = await client.query(queryDiada);
        
        if (resultAssaig.rows.length === 0 && resultDiada.rows.length === 0) {
            return res.status(404).json({ msg: 'No hi ha esdeveniments', status: false });
        }

        let proximAssaig = null;
        if (resultAssaig.rows.length > 0) {
            proximAssaig = resultAssaig.rows[0];
            proximAssaig.dia = formatDate(proximAssaig.dia);
            proximAssaig.hora_inici = formatTime(proximAssaig.hora_inici);
            proximAssaig.hora_fi = formatTime(proximAssaig.hora_fi);
        }
        
        let proximaDiada = null;
        if (resultDiada.rows.length > 0) {
            proximaDiada = resultDiada.rows[0];
            proximaDiada.dia = formatDate(proximaDiada.dia);
            proximaDiada.hora_inici = formatTime(proximaDiada.hora_inici);
            proximaDiada.hora_fi = formatTime(proximaDiada.hora_fi);
        }

        res.status(200).json({ 
            proximAssaig: proximAssaig, 
            proximaDiada: proximaDiada, 
            status: true 
        });
    } 
    catch (error) {
        console.error("Error: ", error);
        res.status(500).json({ msg: 'Error del servidor', status: false });
    } 
    finally {
        client.release();
    }
});


// tronc


app.get('/membres-no-tronc/:id', async (req, res) => {
    const id = req.params.id;
    let client;
    try {
        client = await pool.connect();
        const query = `
            SELECT id, mote, nom, cognoms, alcada_hombro
            FROM membres
            WHERE id NOT IN (SELECT membre_id FROM membres_posicions WHERE esdeveniment_castell_id = $1)
        `;

        const result = await client.query(query, [id]);
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


app.get('/membres-tronc/:id', async (req, res) => {
    const id = req.params.id;
    let client;
    try {
        client = await pool.connect();
        const query = `
            SELECT m.id AS id, m.mote, mp.posicio, m.alcada_hombro, m.nom, m.cognoms
            FROM membres_posicions mp
            JOIN membres m ON mp.membre_id = m.id
            WHERE mp.esdeveniment_castell_id = $1
        `;
        const result = await client.query(query, [id]);
        res.status(200).json({ tronc: result.rows, status: true });
    } 
    catch (error) {
        console.error("Error: ", error);
        res.status(500).json({ msg: 'Error del servidor', status: false });
    } 
    finally {
        client.release();
    }
});


app.put('/actualitzar-tronc/:id', async (req, res) => {
    const id = req.params.id;
    const { membresTronc } = req.body;
    let client;

    try {
        client = await pool.connect();
        await client.query('BEGIN');

        const queryDelete = `DELETE FROM membres_posicions WHERE esdeveniment_castell_id = $1`;
        await client.query(queryDelete, [id]);

        const queryInsert = `INSERT INTO membres_posicions (esdeveniment_castell_id, membre_id, posicio) VALUES ($1, $2, $3)`;
        for (const membre of membresTronc) {
            await client.query(queryInsert, [id, membre.id, membre.posicio]);
        }

        await client.query('COMMIT');
        res.status(200).json({ msg: 'Dades guardades correctament', status: true });
    } 
    catch (error) {
        await client.query('ROLLBACK');
        console.error("Error: ", error);
        res.status(500).json({ msg: 'Error del servidor', status: false });
    } 
    finally {
        if (client) {
            client.release();
        }
    }
});


// pinya


app.get('/membres-no-pinya/:id', async (req, res) => {
    const id = req.params.id;
    let client;
    try {
        client = await pool.connect();
        const query = `
            SELECT id, mote, nom, cognoms, alcada_mans
            FROM membres
            WHERE id NOT IN (SELECT membre_id FROM membres_posicions WHERE esdeveniment_castell_id = $1)
        `;
        const result = await client.query(query, [id]);
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


app.get('/membres-pinya/:id', async (req, res) => {
    const id = req.params.id;
    let client;
    try {
        client = await pool.connect();
        const query = `
            SELECT m.id AS id, m.mote, mp.posicio, m.alcada_mans, m.nom, m.cognoms
            FROM membres_posicions mp
            JOIN membres m ON mp.membre_id = m.id
            WHERE mp.esdeveniment_castell_id = $1
        `;
        const result = await client.query(query, [id]);
        res.status(200).json({ pinya: result.rows, status: true });
    } 
    catch (error) {
        console.error("Error: ", error);
        res.status(500).json({ msg: 'Error del servidor', status: false });
    } 
    finally {
        client.release();
    }
});


app.put('/actualitzar-pinya/:id', async (req, res) => {
    const id = req.params.id;
    const { membresPinya } = req.body;
    let client;
    try {
        client = await pool.connect();
        await client.query('BEGIN');

        const queryDelete = `DELETE FROM membres_posicions WHERE esdeveniment_castell_id = $1`;
        await client.query(queryDelete, [id]);

        const queryInsert = `INSERT INTO membres_posicions (esdeveniment_castell_id, membre_id, posicio) VALUES ($1, $2, $3)`;
        for (const membre of membresPinya) {
            await client.query(queryInsert, [id, membre.id, membre.posicio]);
        }

        await client.query('COMMIT');
        res.status(200).json({ msg: 'Dades guardades correctament', status: true });
    } 
    catch (error) {
        await client.query('ROLLBACK');
        console.error("Error: ", error);
        res.status(500).json({ msg: 'Error del servidor', status: false });
    } 
    finally {
        if (client) {
            client.release();
        }
    }
});


// membres


app.get('/membres', async (req, res) => {
    let client;
    try {
        client = await pool.connect();
        const query = `
            SELECT id, mote, nom, cognoms, alcada_hombro, alcada_mans, comentaris
            FROM membres
        `;

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


app.post('/crear-membre', async (req, res) => {
    const { mote, nom, cognoms, alcada_hombro, alcada_mans, comentaris } = req.body;
    let client;

    try {
        client = await pool.connect();
        const query = `
            INSERT INTO membres (mote, nom, cognoms, alcada_hombro, alcada_mans, comentaris)
            VALUES ($1, $2, $3, $4, $5, $6)
        `;
        const values = [mote, nom, cognoms, alcada_hombro, alcada_mans, comentaris];
        await client.query(query, values);
        res.status(200).json({ msg: 'Membre creat correctament', status: true });
    } 
    catch (error) {
        console.error("Error: ", error);
        res.status(500).json({ msg: 'Error del servidor', status: false });
    } 
    finally {
        client.release();
    }
});


app.delete('/borrar-membre/:id', async (req, res) => {
    const id = req.params.id;
    let client;
    try {
        client = await pool.connect();
        const query = `DELETE FROM membres WHERE id = $1`;
        await client.query(query, [id]);
        res.status(200).json({ msg: 'Membre eliminat correctament', status: true });
    } 
    catch (error) {
        console.error("Error: ", error);
        res.status(500).json({ msg: 'Error del servidor', status: false });
    } 
    finally {
        client.release();
    }
});


app.put('/editar-membre/:id', async (req, res) => {
    const id = req.params.id;
    const { mote, nom, cognoms, alcada_hombro, alcada_mans, comentaris } = req.body;
    let client;
    try {
        client = await pool.connect();
        const query = `
            UPDATE membres 
            SET mote = $1, nom = $2, cognoms = $3, alcada_hombro = $4, alcada_mans = $5, comentaris = $6
            WHERE id = $7
        `;
        const values = [mote, nom, cognoms, alcada_hombro, alcada_mans, comentaris, id];
        await client.query(query, values);
        res.status(200).json({ msg: 'Membre actualitzat correctament', status: true });
    } 
    catch (error) {
        console.error("Error: ", error);
        res.status(500).json({ msg: 'Error del servidor', status: false });
    } 
    finally {
        client.release();
    }
});


// castells


app.get('/castell/:id', async (req, res) => {
    const id = req.params.id;   
    let client;
    try {
        client = await pool.connect();
        const query = `
            SELECT c.nom, c.amplada, c.alcada, c.agulla, c.folre, c.manilles, c.puntals, c.per_sota, c.margarita
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


// altres


app.post('/perfil', async (req, res) => {
    const email = req.body.email;
    let client;
    try {
        client = await pool.connect();
        const query = `
            SELECT u.nom, u.cognoms, u.email, r.rol
            FROM users u JOIN rols r ON u.rol_id = r.id 
            WHERE u.email = $1
        `;
        const result = await client.query(query, [email]);
        res.status(200).json({ dades: result.rows[0], status: true });
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