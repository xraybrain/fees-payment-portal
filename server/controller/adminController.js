const baseModel = require('../models/index');
const passport = require('passport');

exports.showDashboard = (req, res, next) => {
  res.render('admin/dashboard', {
    pageTitle: `Payment portal | dashboard`
  });
};

exports.showFees = async (req, res, next) => {
  let levelCategories = [];

  try {
    levelCategories = await baseModel.LevelCategory.findAll({
      order: [['name', 'ASC']]
    });
  } catch (error) {
    console.log(error);
  }

  console.log(levelCategories);

  res.render('admin/fees', {
    pageTitle: `Payment portal | fees`,
    levelCategories
  });
};

exports.showResetPassword = (req, res, next) => {
  res.render('admin/reset_password', {
    pageTitle: 'Payment portal | reset password'
  });
};

exports.showPayments = (req, res, next) => {
  res.render('admin/payments', {
    pageTitle: `Payment portal | Payments`
  });
};

exports.showStudents = (req, res, next) => {
  res.render('admin/students', {
    pageTitle: `Payment portal | Students`,
    action: req.query.searchQuery ? 'search' : ''
  });
};

exports.showDepartments = (req, res, next) => {
  res.render('admin/departments', {
    pageTitle: `Payment portal | Departments`
  });
};

exports.showProfile = (req, res, next) => {
  res.render('admin/profile', {
    pageTitle: `Payment portal | Profile`
  });
};

exports.showSignin = (req, res, next) => {
  res.render('admin/signin', {
    pageTitle: `Payment portal | Admin Signin`
  });
};

exports.signIn = (req, res, next) => {
  require('../services/passport')(passport, 'Admin');

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

exports.showAdmins = (req, res, next) => {
  res.render('admin/admins', {
    pageTitle: `Payment portal | Manage Admins`
  });
};

exports.signOut = (req, res, next) => {
  req.logOut();
  res.redirect('/admin/signin/');
};
