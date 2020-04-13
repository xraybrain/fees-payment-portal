let key = require('../config/config')[process.env.NODE_ENV || 'development'];
const sequelize = require('sequelize');
const baseModel = require('../models/index');

exports.showHomePage = (req, res, next) => {
  new sequelize(key)
    .authenticate()
    .then(result => {
      console.log(result);
      baseModel.Admin.findOne({ where: { userRole: 'SUPERUSER' } })
        .then(admin => {
          if (admin) {
            res.render('index', { pageTitle: 'Payment Portal' });
          } else {
            res.redirect('/config/admin/');
          }
        })
        .catch(error => {
          console.log(error);
        });
    })
    .catch(error => {
      console.log(error);
      res.redirect('/config/database/');
    });
};

exports.showSignUpPage = (req, res, next) => {
  res.render('student/signup', { pageTitle: 'Payment Portal | Signup' });
};

exports.showSigninPage = (req, res, next) => {
  res.render('student/signin', { pageTitle: 'Payment Portal | Signin' });
};

exports.signOut = (req, res, next) => {
  req.logOut();
  res.redirect('/signin/');
};

exports.showDatabaseConfig = (req, res, next) => {
  res.render('config_database', {
    pageTitle: 'Payment Portal | Database Not Found'
  });
};

exports.showAdminConfig = (req, res, next) => {
  res.render('config_admin', {
    pageTitle: 'Payment Portal | Admin Configuration'
  });
};

exports.showContact = (req, res, next) => {
  res.render('contact', {
    pageTitle: 'Payment Portal | Contact Us'
  });
}