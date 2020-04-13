const {
  showHomePage,
  showSignUpPage,
  showSigninPage,
  signOut,
  showDatabaseConfig,
  showAdminConfig,
  showContact
} = require('../controller/indexController');

module.exports = app => {
  app.get('/', showHomePage);

  app.get('/signup/', showSignUpPage);

  app.get('/signin/', showSigninPage);

  app.get('/signout/', signOut);

  app.get('/config/database/', showDatabaseConfig);

  app.get('/config/admin/', showAdminConfig);

  app.get('/contactus/', showContact);
};
