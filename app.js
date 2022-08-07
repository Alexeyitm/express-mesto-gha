const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const { celebrate, Joi } = require('celebrate');
const { login, setUser } = require('./controllers/users');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;

const app = express();
app.use(express.json());
mongoose.connect('mongodb://localhost:27017/mestodb', {});

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }).unknown(true),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().link(),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }).unknown(true),
}), setUser);

app.use('/users', auth, require('./routes/users'));
app.use('/cards', auth, require('./routes/cards'));

app.use('/*', (req, res) => res.status(404).send({ message: 'К сожалению, запрашиваемая страница не найдена.' }));
app.use(errors());

app.listen(PORT, () => {
  console.log('Example app listening on port 3000!');
});
