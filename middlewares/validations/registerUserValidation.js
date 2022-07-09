const { check, validationResult } = require('express-validator');

const toastr = require('../../helpers/toastr');
const User = require('../../models/User');

module.exports = [
  check('name').not().isEmpty().withMessage('Name should not be empty'),
  check('password').not().isEmpty().withMessage('Password should not be empty'),
  check('email').not().isEmpty().withMessage('Email should not be empty'),
  check('email').isEmail().withMessage('Please Enter Valid Email')
  .custom((userEmail)=> {
      return User.findOne({email:userEmail}).then(user => {
          if (user) {
              return Promise.reject('Email is already exists!')
          }
      })
  }),

  function (req, res, next) {
    var errorValidation = validationResult(req);
    if (!errorValidation.isEmpty()) {
      for (let i = 0; i < errorValidation.array().length; i++) {
        toastr.sendToastr(req, 'error', errorValidation.array()[i].msg);
      }

      return res.status(500).redirect('/register');
    }
    next();
  },
];
