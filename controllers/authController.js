const bcrypt = require('bcrypt');

const User = require('../models/User');
const Course = require('../models/Course');
const Category = require('../models/Category');
const toastr = require('../helpers/toastr');

exports.registerUser = async (req, res) => {
  try {
    await User.create(req.body);
    return res.status(200).redirect('/login');
  } catch (error) {
    return res.status(500).redirect('/register');
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      toastr.sendToastr(req, 'error', 'Boyle bir kullanici bulunamadi');
      return res.status(401).redirect('/login');
    }

    await bcrypt.compare(password, user.password, (err, same) => {
      if (!same) {
        toastr.sendToastr(req, 'error', 'Sifre veya kullanici adi yanlis');
        return res.status(401).redirect('/login');
      }

      req.session.userID = user._id;
      return res.status(200).redirect('/');
    });
  } catch (error) {
    toastr.sendToastr(req, 'error', error);
    return res.status(500).redirect('/login');
  }
};

exports.logoutUser = async (req, res) => {
  req.session.destroy(() => {
    return res.redirect('/');
  });
};

exports.getDashboardPage = async (req, res) => {
  try {
    const user = await User.findById(req.session.userID).populate('courses');
    const categories = await Category.find();
    const courses = await Course.find({ user: req.session.userID }).sort('-createdAt');

    return res.status(200).render('dashboard', {
      page_name: 'dashboard',
      user: user,
      courses: courses,
      categories: categories,
    });
  } catch (error) {
    toastr.sendToastr(req, 'error', error);
    return res.status(500).redirect('/');
  }
};
