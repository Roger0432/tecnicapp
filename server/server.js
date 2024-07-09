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
const JWT_REFRESH_SECRET="tecnicapp-refreh-secret"
const CODI_ACTIVACIO="tecnica2024"

const pool = new Pool({
    user: POSTGRES_USER,
    host: POSTGRES_HOST,
    database: POSTGRES_DATABASE,
    password: POSTGRES_PASSWORD,
    port: POSTGRES_PORT,
    ssl: { rejectUnauthorized: false }
});


app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const client = await pool.connect();
        const query = `SELECT * FROM users WHERE email = '${email}'`;
        const result = await client.query(query);
        client.release();

        if (result.rows.length == 0) {0
            return res.status(401).json({ msg: "Usuari incorrecte" });
        }

        const user_db = result.rows[0];

        if (!(await bcrypt.compare(password, user_db.password))) {
            return res.status(401).json({ msg: "Contrasenya incorrecte" });
        }

        const token = jwt.sign({ email: user_db.email }, JWT_SECRET, { expiresIn: '1h' });
        const refreshToken = jwt.sign({ email: user_db.email }, JWT_REFRESH_SECRET, { expiresIn: '7d' });
        res.json({ token, refreshToken });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error del servidor.' });
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
            return res.status(400).json({ msg: 'Aquest correu electrònic ja està registrat.' });
        }

        if (req.body.codiactivacio != CODI_ACTIVACIO) {
            return res.status(400).json({ msg: 'Codi d\'activació incorrecte' });
        }

        const queryInsert = `
            INSERT INTO users (nom, cognoms, email, password, rol) 
            VALUES ('${nom}', '${cognoms}', '${email}', '${bcrypt.hashSync(password, 10)}', '${rol}')
        `;
        await client.query(queryInsert);
        client.release();

        res.status(201).json({ msg: 'Usuari creat correctament' });

    } catch (error) {
        res.status(500).json({ msg: 'Error del servidor.' });
    }
});


app.listen(port, () => {
    console.log('Server is running on port ' + port);
});