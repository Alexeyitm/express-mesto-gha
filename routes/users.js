const router = require('express').Router();
const { getAllUsers, getUserById, setUser } = require('../controllers/users');

router.get('/', getAllUsers);
router.get('/:userId', getUserById);
router.post('/', setUser);

module.exports = router;
