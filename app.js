const path = require('path');
const express = require('express');
const exphbs = require('express-handlebars');
const passport = require('passport');
const session = require('express-session');
const method = require('method-override');
const flash = require('connect-flash');
const PUBLIC_DIR = path.join(__dirname, 'public');

const app = express();

// setup the public directory
app.use(express.static(PUBLIC_DIR));

const VIEW_HOME = path.join(__dirname, '/server/views');

// middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({ saveUninitialized: true, resave: false, secret: 'mysecretisyou' })
);

app.use(passport.initialize());
app.use(passport.session());

app.engine(
  'hbs',
  exphbs({
    layoutDir: `${VIEW_HOME}/layouts`,
    partialsDir: `${VIEW_HOME}/partials`,
    extname: 'hbs',
    helpers: {
      isEqual: (val1, val2) => {
        return val1 === val2;
      }
    }
  })
);

app.set('view engine', 'hbs');
app.set('views', VIEW_HOME);
app.use(method('_method'));
app.use(flash());

app.use((req, res, next) => {
  res.locals.user = req.user || null;
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');

  next();
});

// setup routes
require('./server/routes/index')(app);
require('./server/routes/student')(app);
require('./server/routes/admin')(app);
require('./server/routes/api')(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`server up on port:: [${PORT}]`);
});


process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";