const express = require('express');
const cors = require('cors');

require('dotenv').config();
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 5000;

const corsOptions = {
    origin: 'https://tecnicapp-client.vercel.app',
};
app.use(cors(corsOptions));

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
    ssl: {
        rejectUnauthorized: false
    }
});

app.get('/api', (req, res) => {
    res.json({ "users": ["user1", "user2", "user3"] });
});

app.get('/users', async (req, res) => {
    const response = await pool.query('SELECT name, username, email FROM users');
    res.json(response.rows);
});

app.listen(port, () => {
    console.log('Server is running on port ' + port);
});