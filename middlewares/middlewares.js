module.exports.setUserId = (req, _, next) => {
  req.user = {
    _id: '624e9faa492b32e52b32922f',
  };

  next();
};
