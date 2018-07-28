const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const { mongoURI } = require('./keys');
const routes = require('./routes/routes');

const app = express();
app.use(cors({ optionsSuccessStatus: 200 }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('build'));

routes(app);
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
});

mongoose.connect(mongoURI);
mongoose.connection
  .once('open', () => console.log('Connection Established'))
  .on('error', (error) => console.warn('Warning', error));

const PORT = process.env.PORT || 5000;
app.listen(PORT);
