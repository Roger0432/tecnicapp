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

/*
const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DATABASE,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT,
});
*/
const pool = new Pool({
    user: 'default',
    host: 'ep-calm-tooth-a2colsi9-pooler.eu-central-1.aws.neon.tech',
    database: 'verceldb',
    password: 'o1fvCj6tIAHc',
    port: 5432,
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