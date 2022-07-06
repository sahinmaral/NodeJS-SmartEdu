const moment = require('moment');
const Course = require('../models/Course');

exports.createCourse = async (req, res) => {
  try {
    await Course.create(req.body);

    res.status(201).json({
      status: 'success',
      course: req.body,
    });
  } catch (error) {
    res.status(501).json({
      status: 'fail',
      error,
    });
  }
};

exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).render('courses', {
      courses: courses,
      page_name: 'courses',
    });
  } catch (error) {
    res.status(501).json({
      status: 'fail',
      error,
    });
  }
};

exports.getCourse = async (req, res) => {
  try {
    const course = await Course.findOne({'slug' : req.params.slug});

    let modifiedCourse = {
      name:course.name,
      description:course.description,
      createdAt:course.createdAt,
      createdAtStr:moment(course.createdAt).format('MMMM Do YYYY')
    };
    
    res.status(200).render('course', {
      course: modifiedCourse,
      page_name: 'courses',
    });
  } catch (error) {
    res.status(501).json({
      status: 'fail',
      error,
    });
  }
};
