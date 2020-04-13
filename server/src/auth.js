const adminPermissions = require('../controller/permissions/adminPermission');

exports.ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  req.flash('error', 'access denied, please signin.');
  res.redirect('/');
};

exports.ensureIsAdmin = (req, res, next) => {
  if (req.user.role === 'Admin') {
    return next();
  }

  req.flash('error', 'access denied, only admins can view this page.');
  res.redirect('/');
};

exports.ensureIsApproved = (req, res, next) => {
  if (req.user.status) {
    return next();
  }

  req.flash(
    'error',
    'access denied, your account has not been approved by the admin.'
  );
  res.redirect('/');
};

exports.hasPermission = (req, res, next) => {
  if (req.user) {
    const action = req.method;
    const permissions = adminPermissions[req.user.userRole];
    const isPermited = permissions.includes(action);

    if (isPermited) {
      return next();
    }

    res.json({
      error: true,
      message: 'access denied, you are not permited to perform this action.'
    });
  } else {
    next();
  }
};
