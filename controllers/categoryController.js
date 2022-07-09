const Category = require('../models/Category');

exports.createCategory = async (req, res) => {
  try {
    await Category.create(req.body);

    return res.status(201).redirect('/users/dashboard');
  } catch (error) {
    return res.status(501).json({
      status: 'fail',
      error,
    });
  }
};
