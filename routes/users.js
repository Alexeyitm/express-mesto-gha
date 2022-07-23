const router = require('express').Router();
const {
  getAllUsers,
  getUserById,
  setUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

router.get('/', getAllUsers);
router.get('/:userId', getUserById);
router.post('/', setUser);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
