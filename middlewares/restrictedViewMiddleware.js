const User = require("../models/User");

module.exports = (roles) => {
  return async(req, res, next) => {
    const user = await User.findById(req.session.userID)
    if (!user || !roles.includes(user.role))
      return res.status(401).send('Unauthorized process');


    next();
  };
};
