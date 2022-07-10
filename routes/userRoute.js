const express = require('express');

const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const registerMiddleware = require('../middlewares/registerMiddleware');
const registerUserValidation = require('../middlewares/validations/registerUserValidation');

const router = express.Router();

router.route('/register').post([registerMiddleware,registerUserValidation], authController.registerUser);
router.route('/login').post(authController.loginUser);
router.route('/logout').get(authController.logoutUser);
router.route('/dashboard').get(authMiddleware, authController.getDashboardPage);
router.route('/toggleBanUser').put(authMiddleware, authController.toggleBanUser);

module.exports = router;
