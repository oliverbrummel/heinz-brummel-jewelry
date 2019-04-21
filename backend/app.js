const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  next();
});

app.post('/api/earrings', (req, res, next) => {
  const newEarring = req.body;
  console.log('New Earring Post!', newEarring);
});

app.use('/api/earrings', (req, res, next) => {
  const jewelryBags = [
    {
      id: 1,
      name: 'Golden Bulbs',
      desc: 'oxidized silver, gold, gold leaf over wood',
      image: ''
    },
    {
      id: 2,
      name: 'Big Red Hearts',
      desc: 'enamel, silver, gold, black onyx',
      image: ''
    }
  ];
  res.status(200).json({
    message: 'Earrings fetched successfully!',
    data: jewelryBags
  });
});

module.exports = app;

