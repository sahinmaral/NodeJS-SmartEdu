const Course = require('../models/Course');
const toastr = require('../helpers/toastr');

module.exports = async (req, res, next) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug }).populate(
      'category'
    );

    if (course.category.isDisabled)
      throw "This course's category is disabled , you cannot enter this course";

    next();
  } catch (error) {
    toastr.sendToastr(req, 'error', JSON.stringify(error));
    res.status(500).redirect('/courses');
  }
};
