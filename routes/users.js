const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const {
  getAllUsers,
  getMe,
  getUserById,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

router.get('/', getAllUsers);

router.get('/me', getMe);

router.get('/:userId', celebrate({
  params: {
    userId: Joi.string().hex().length(24),
  },
}), getUserById);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }).unknown(true),
}), updateUser);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().regex(/^http(s)?:\/\/(www.)?([\w-]+\.)+\/?\S*$/),
  }).unknown(true),
}), updateAvatar);

module.exports = router;
