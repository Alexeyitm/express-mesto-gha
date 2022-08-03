const express = require('express');
const mongoose = require('mongoose');

const { login, setUser } = require('./controllers/users');

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '62dac5d71b1e2afdfd4a0b95',
  };

  next();
});

mongoose.connect('mongodb://localhost:27017/mestodb', {});

app.post('/signin', login);
app.post('/signup', setUser);
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use('/*', (req, res) => res.status(404).send({ message: 'К сожалению, запрашиваемая страница не найдена.' }));

app.listen(PORT, () => {
  console.log('Example app listening on port 3000!');
});
