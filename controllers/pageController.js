const mailService = require('../helpers/mailService');
const toastr = require('../helpers/toastr');

exports.getIndexPage = (req, res) => {
  return res.status(200).render('index', { page_name: 'index' });
};

exports.getAboutPage = (req, res) => {
  return res.status(200).render('about', { page_name: 'about' });
};

exports.getContactPage = (req, res) => {
  return res.status(200).render('contact', { page_name: 'contact' });
};

exports.sendContact = async (req, res) => {
  try {
    await mailService.sendInputToEmail(req.body);
    toastr.sendToastr(req,'success', 'We received your message successfully');
    return res.status(200).redirect('/contact');
  } catch (error) {
    toastr.sendToastr(
      req,
      'error',
      'There has been an error when you are sending your message'
    );
    return res.status(200).redirect('/contact');
  }
};

exports.getLoginPage = (req, res) => {
  return res.status(200).render('login', { page_name: 'login' });
};

exports.getRegisterPage = (req, res) => {
  return res.status(200).render('register', { page_name: 'register' });
};
