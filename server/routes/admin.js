const {
  showDashboard,
  showFees,
  showResetPassword,
  showPayments,
  showStudents,
  showDepartments,
  showProfile,
  showSignin,
  signIn,
  showAdmins,
  signOut
} = require('../controller/adminController');
const { ensureAuthenticated, ensureIsAdmin } = require('../src/auth');

module.exports = app => {
  app.get('/admin/', ensureAuthenticated, ensureIsAdmin, showDashboard);

  app.get('/admin/signin/', showSignin);

  app.post('/admin/signin/', signIn);

  app.get('/admin/fees/', ensureAuthenticated, ensureIsAdmin, showFees);

  app.get('/admin/reset/password/', showResetPassword);

  app.get('/admin/payments/', ensureAuthenticated, ensureIsAdmin, showPayments);

  app.get('/admin/students/', ensureAuthenticated, ensureIsAdmin, showStudents);

  app.get(
    '/admin/departments/',
    ensureAuthenticated,
    ensureIsAdmin,
    showDepartments
  );

  app.get('/admin/profile/', ensureAuthenticated, ensureIsAdmin, showProfile);

  app.get('/admin/admins/', ensureAuthenticated, ensureIsAdmin, showAdmins);

  app.get('/admin/signout/', signOut);
};
