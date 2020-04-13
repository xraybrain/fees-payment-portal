const LocalStrategy = require('passport-local').Strategy;
const baseModel = require('../models/index');
const bcrypt = require('bcryptjs');

module.exports = (passport, model) => {
  passport.use(
    new LocalStrategy(
      { usernameField: 'emailAddress' },
      async (emailAddress, password, done) => {
        const user = await baseModel[model].findOne({
          where: { emailAddress }
        });

        if (!user) {
          return done(null, false, {
            message: 'wrong email and password combination.'
          });
        }

        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (isMatch) {
            user['role'] = model;
            return done(null, user);
          } else {
            return done(null, false, {
              message: 'wrong email and password combination.'
            });
          }
        });
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, {
      _id: user.id,
      role: user.role
    });
  });

  passport.deserializeUser(async (hash, done) => {
    model = hash.role;

    let user = null;
    if (model === 'Student') {
      user = await baseModel[model].findOne({
        where: { id: hash._id },
        include: [
          { model: baseModel.Department },
          { model: baseModel.LevelCategory }
        ]
      });
      user.role = 'Student';
      user.id = user.dataValues.id;
      user.fullName =
        user.lastName + ' ' + user.firstName + ' ' + user.middleName;
    } else if (model === 'Admin') {
      user = await baseModel[model].findOne({
        where: { id: hash._id }
      });
      user.role = 'Admin';
      user.userName = `${user.firstName} ${user.lastName}`;
      user.currentRole = user.userRole;
    }

    if (user) done(null, user);
    else done(null, false);
  });
};
