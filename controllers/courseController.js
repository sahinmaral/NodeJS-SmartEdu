const moment = require('moment');

const toastr = require('../helpers/toastr');
const Course = require('../models/Course');
const Category = require('../models/Category');
const User = require('../models/User');

exports.createCourse = async (req, res) => {
  try {
    await Course.create({
      name: req.body.name,
      description: req.body.name,
      category: req.body.category,
      user: req.session.userID,
    });

    req.flash('success', `${req.body.name} has been created successfully`);
    return res.status(201).redirect('/users/dashboard');
  } catch (error) {
    return res.status(501).json({
      status: 'fail',
      error,
    });
  }
};

exports.getAllCourses = async (req, res) => {
  try {
    let filter = {};

    if (req.query.categories) {
      const category = await Category.findOne({ slug: req.query.categories });
      filter = { category: category._id };
    }

    if (req.query.search) {
      filter = { name: req.query.search };
    }

    if (!req.query.search && !req.query.categories) {
      filter.name = '';
      filter.category = null;
    }

    const courses = await Course.find({
      $or: [
        { category: filter.category },
        { name: { $regex: '.*' + filter.name + '.*', $options: 'i' } },
      ],
    }).sort('-createdAt');
    const categories = await Category.find();

    return res.status(200).render('courses', {
      courses: courses,
      categories: categories,
      page_name: 'courses',
    });
  } catch (error) {
    return res.status(501).json({
      status: 'fail',
      error: error,
    });
  }
};

exports.getCourse = async (req, res) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug }).populate(
      'user'
    );
    const categories = await Category.find();

    let modifiedCourse = {
      _id: course._id,
      name: course.name,
      description: course.description,
      user: course.user,
      createdAtStr: moment(course.createdAt).format('MMMM Do YYYY'),
    };

    return res.status(200).render('course', {
      course: modifiedCourse,
      categories: categories,
      page_name: 'courses',
    });
  } catch (error) {
    return res.status(501).json({
      status: 'fail',
      error,
    });
  }
};

exports.enrollCourse = async (req, res) => {
  try {
    const user = await User.findById(req.session.userID);
    await user.courses.push({ _id: req.body.course_id });
    await user.save();

    res.status(201).redirect('/courses');
  } catch (error) {
    return res.status(501).json({
      status: 'fail',
      error,
    });
  }
};

exports.releaseCourse = async (req, res) => {
  try {
    const user = await User.findById(req.session.userID);
    await user.courses.pull({ _id: req.body.course_id });
    await user.save();

    res.status(201).redirect('/courses');
  } catch (error) {
    return res.status(501).json({
      status: 'fail',
      error,
    });
  }
};

exports.deleteCourse = async (req, res) => {
  const session = await User.startSession();

  try {
    const foundCourse = await Course.findOne({ slug: req.params.slug });
    const users = await User.find().populate('courses');
    const usersHasCourse = users.filter((user) =>
      user.courses.some((course) => course.slug === foundCourse.slug)
    );

    // After deleting this course of users that has got ,
    // we might get error (like database) after this process

    // Because of this kinda error , we have to start transaction
    // and if any error will occur after first process , it has to revert
    // first process
    session.startTransaction();

    for (let i = 0; i < usersHasCourse.length; i++) {
      await usersHasCourse[i].courses.pull({ _id: foundCourse._id });
      await usersHasCourse[i].save({ session: session });
    }

    await foundCourse.delete();

    await session.commitTransaction();
    session.endSession();

    toastr.sendToastr(
      req,
      'success',
      `${foundCourse.name} has been removed successfully`
    );
    res.status(200).redirect('/users/dashboard');
  } catch (error) {

    await session.abortTransaction();
    session.endSession();

    toastr.sendToastr(req, 'error', JSON.stringify(error));
    res.status(500).redirect('/users/dashboard');
  }
};
