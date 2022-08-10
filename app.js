const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const { celebrate, Joi } = require('celebrate');
const cookieParser = require('cookie-parser');
const { login, setUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const error = require('./middlewares/error');
const NotFoundError = require('./errors/not-found-error');

const { PORT = 3000 } = process.env;

const app = express();

app.use(cookieParser());
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
    avatar: Joi.string().regex(/^http(s)?:\/\/(www.)?([\w-]+\.)+\/?\S*$/),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }).unknown(true),
}), setUser);

app.use('/users', auth, require('./routes/users'));
app.use('/cards', auth, require('./routes/cards'));

app.use('/*', () => {
  throw new NotFoundError('К сожалению, запрашиваемая страница не найдена.');
});
app.use(errors());

app.use(error);

app.listen(PORT, () => {
  console.log('Example app listening on port 3000!');
});
