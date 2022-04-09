const router = require('express').Router();

const {
  getUsers,
  getUserById,
  createUser,
  patchUserBio,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUserById);
router.post('/', createUser);
router.patch('/me', patchUserBio);

module.exports = router;
