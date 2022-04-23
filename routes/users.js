const router = require('express').Router();
const { celebrate } = require('celebrate');
const { getUserByIdSchema, patchUserBioSchema, patchUserAvatarSchema } = require('../middlewares/validator');

const {
  getUsers, getUserById, getUser, patchUserBio, patchUserAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getUser);
router.get('/:userId', celebrate(getUserByIdSchema), getUserById);
router.patch('/me', celebrate(patchUserBioSchema), patchUserBio);
router.patch('/me/avatar', celebrate(patchUserAvatarSchema), patchUserAvatar);

module.exports = router;
