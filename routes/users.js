const router = require('express').Router();

const {
  getUsers, getUserById, getUser, patchUserBio, patchUserAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getUser);
router.get('/:userId', getUserById);
router.patch('/me', patchUserBio);
router.patch('/me/avatar', patchUserAvatar);

module.exports = router;
