const router = require('express').Router();

const {
  getUsers, getUserById, createUser, patchUserBio, patchUserAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUserById);
router.post('/', createUser);
router.patch('/me', patchUserBio);
router.patch('/me/avatar', patchUserAvatar);

module.exports = router;
