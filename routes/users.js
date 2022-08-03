const router = require('express').Router();
const {
  getAllUsers,
  getUserById,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

router.get('/', getAllUsers);
router.get('/:userId', getUserById);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
