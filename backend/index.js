const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Backend fonctionne !' });
});

app.get('/todos', (req, res) => {
  res.json([
    { id: 1, title: 'Apprendre Azure', done: false },
    { id: 2, title: 'Finir le TP', done: false }
  ]);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});