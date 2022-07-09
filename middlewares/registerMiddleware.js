const toastr = require('../helpers/toastr');

module.exports = (req, res, next) => {
  if (req.body.role === 'admin') {
    toastr.sendToastr(req, 'error', 'Role of new user cannot be admin');
    return res.status(401).redirect('/register');
  }

  next();
};
