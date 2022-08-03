const express = require('express');
const mongoose = require('mongoose');

const { errors } = require('celebrate');
const { login, setUser } = require('./controllers/users');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());

mongoose.connect('mongodb://localhost:27017/mestodb', {});

app.use(auth);

app.post('/signin', login);
app.post('/signup', setUser);

app.use(errors());

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use('/*', (req, res) => res.status(404).send({ message: 'К сожалению, запрашиваемая страница не найдена.' }));

app.listen(PORT, () => {
  console.log('Example app listening on port 3000!');
});
