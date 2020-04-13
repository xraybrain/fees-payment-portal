const {
  showDashboard,
  showReceipts,
  showReceipt,
  showFees,
  showProfile,
  showEditProfile,
  showResetPassword,
  signIn,
  showMakePayment,
  makePayment
} = require('../controller/studentController');
const { ensureAuthenticated, ensureIsApproved } = require('../src/auth');
module.exports = app => {
  app.get('/student/', ensureAuthenticated, ensureIsApproved, showDashboard);

  app.post('/student/signin/', signIn);

  app.get(
    '/student/receipts/',
    ensureAuthenticated,
    ensureIsApproved,
    showReceipts
  );

  app.get('/student/receipt/:id/', showReceipt);

  app.get('/student/fees/', ensureAuthenticated, ensureIsApproved, showFees);

  app.get(
    '/student/profile/',
    ensureAuthenticated,
    ensureIsApproved,
    showProfile
  );

  app.get('/student/edit/profile/', showEditProfile);

  app.get('/student/reset/password/', showResetPassword);

  app.post(
    '/student/makepayment/',
    ensureAuthenticated,
    ensureIsApproved,
    showMakePayment
  );
};
