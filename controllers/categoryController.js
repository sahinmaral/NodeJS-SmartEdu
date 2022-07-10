const Category = require('../models/Category');
const toastr = require('../helpers/toastr');

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

exports.toggleDisable = async (req, res) => {
  try {
    const category = await Category.findById(req.body.id);
    category.isDisabled = !category.isDisabled;
    await category.save();

    let message = '';
    if (category.isDisabled)
      message = `${category._id} ID li kategori erisime kapali`;
    else message = `${category._id} ID li kategori artik erisime acik`;

    toastr.sendToastr(req, 'success', message);
    return res.status(201).redirect('/users/dashboard');
  } catch (error) {
    toastr.sendToastr(req, 'error', JSON.stringify(error));
    return res.status(501).redirect('/users/dashboard');
  }
};
