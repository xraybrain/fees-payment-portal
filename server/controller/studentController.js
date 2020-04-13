const passport = require('passport');
const { sanitize } = require('../src/validator');
const baseModel = require('../models/index');

exports.showDashboard = (req, res, next) => {
  res.render('student/dashboard', { pageTitle: 'Payment portal | dashboard' });
};

exports.showReceipts = (req, res, next) => {
  res.render('student/receipts', {
    pageTitle: 'Payment portal | Receipts'
  });
};

exports.showReceipt = (req, res, next) => {
  res.render('student/receipt', {
    pageTitle: 'Payment portal | Receipts',
    paymentId: req.params.id
  });
};

exports.showProfile = (req, res, next) => {
  res.render('student/profile', {
    pageTitle: 'Payment portal | My Profile'
  });
};

exports.showEditProfile = (req, res, next) => {
  res.render('student/edit_profile', {
    pageTitle: 'Payment portal | Edit Profile'
  });
};

exports.showResetPassword = (req, res, next) => {
  res.render('student/reset_password', {
    pageTitle: 'Payment portal | Reset Password'
  });
};

exports.showFees = (req, res, next) => {
  res.render('student/fees', {
    pageTitle: 'Payment portal | Fees'
  });
};
exports.signIn = (req, res, next) => {
  require('../services/passport')(passport, 'Student');

  passport.authenticate('local', (error, user, info) => {
    if (error || !user) {
      res.status(200);
      return res.json({ error: true, ...info });
    }

    req.login(user, error => {
      if (error) return next(error);
      res.status(200);
      return res.json({ error: null, message: 'signin successfully' });
    });
  })(req, res, next);
};

exports.showMakePayment = (req, res, next) => {
  res.render('student/make_payment', {
    pageTitle: 'Payment portal | Make Payment',
    id: req.body.id,
    studentId: req.user ? req.user.id : ''
  });
};