const express = require('express');
const courseController = require('../controllers/courseController');
const restrictedViewMiddleware = require('../middlewares/restrictedViewMiddleware');

const router = express.Router();

router.route('/').post(restrictedViewMiddleware(['teacher','admin']),courseController.createCourse);
router.route('/').get(courseController.getAllCourses);
router.route('/:slug').get(courseController.getCourse);
router.route('/:slug').delete(courseController.deleteCourse);
router.route('/:slug').put(courseController.updateCourse);
router.route('/enroll').post(courseController.enrollCourse);
router.route('/release').post(courseController.releaseCourse);

module.exports = router;
