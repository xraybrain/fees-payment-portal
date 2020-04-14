const {
  showDashboard,
  showReceipts,
  showReceipt,
  showFees,
  showProfile,
  showEditProfile,
  signIn,
  showMakePayment
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

  app.get(
    '/student/receipt/:id/',
    ensureAuthenticated,
    ensureIsApproved,
    showReceipt
  );

  app.get('/student/fees/', ensureAuthenticated, ensureIsApproved, showFees);

  app.get(
    '/student/profile/',
    ensureAuthenticated,
    ensureIsApproved,
    showProfile
  );

  app.get(
    '/student/edit/profile/',
    ensureAuthenticated,
    ensureIsApproved,
    showEditProfile
  );

  app.post(
    '/student/makepayment/',
    ensureAuthenticated,
    ensureIsApproved,
    showMakePayment
  );
};
