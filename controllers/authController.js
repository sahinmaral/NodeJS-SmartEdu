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
    toastr.sendToastr(req, 'error', JSON.stringify(error));
    return res.status(500).redirect('/register');
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      toastr.sendToastr(req, 'error', 'User does not exist');
      return res.status(401).redirect('/login');
    }

    await bcrypt.compare(password, user.password, (err, same) => {
      if (!same) {
        toastr.sendToastr(req, 'error', 'Invalid email or password');
        return res.status(401).redirect('/login');
      }

      req.session.userID = user._id;
      return res.status(200).redirect('/');
    });
  } catch (error) {
    toastr.sendToastr(req, 'error', JSON.stringify(error));
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
    const users = await User.find();
    const categories = await Category.find();
    const courses = await Course.find({ user: req.session.userID }).sort(
      '-createdAt'
    );

    const filteredUsers = users.filter((element) => {
      if (element.email !== user.email) return element;
    });

    return res.status(200).render('dashboard', {
      page_name: 'dashboard',
      user: user,
      users: filteredUsers,
      courses: courses,
      categories: categories,
    });
  } catch (error) {
    toastr.sendToastr(req, 'error', JSON.stringify(error));
    return res.status(500).redirect('/');
  }
};

exports.toggleBanUser = async (req, res) => {
  try {
    const user = await User.findById(req.body.id);
    user.isBanned = !user.isBanned;
    await user.save();

    let message = '';
    if (user.isBanned) message = `User has ${user._id} ID banned successfully`;
    else
      message = `User has ${user._id} ID's ban has been removed successfully`;
    toastr.sendToastr(req, 'success', message);
    return res.status(200).redirect('/users/dashboard');
  } catch (error) {
    toastr.sendToastr(req, 'error', error);
    return res.status(500).redirect('/users/dashboard');
  }
};
