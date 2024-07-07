const cors = require('cors');
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

const corsOptions = {
    origin: 'https://tecnicapp-client.vercel.app',
};

app.use(cors(corsOptions));

app.get('/api', (req, res) => {
    res.json({ "users": ["user1", "user2", "user3"] });
});

app.listen(port, () => {
    console.log('Server is running on port ' + port);
});