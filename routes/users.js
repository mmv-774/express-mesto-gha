const router = require('express').Router();

const {
  getUsers, getUserById, getUser, patchUserBio, patchUserAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUserById);
router.get('/me', getUser);
router.patch('/me', patchUserBio);
router.patch('/me/avatar', patchUserAvatar);

module.exports = router;
