require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const { sequelize } = require('./models');
const passport = require('./config/passport');

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Middleware ───
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Session ───
const sessionStore = new SequelizeStore({ db: sequelize });

app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback-secret',
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    httpOnly: true,
    sameSite: 'lax',
    secure: false, // Set to true in production with HTTPS
  },
}));

// ─── Passport ───
app.use(passport.initialize());
app.use(passport.session());

// ─── Routes ───
app.use('/auth', require('./routes/auth'));
app.use('/api/flights', require('./routes/flights'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/airlines', require('./routes/airlines'));
app.use('/api/airports', require('./routes/airports'));
app.use('/api/aircraft', require('./routes/aircraft'));
app.use('/api/crew', require('./routes/crew'));
app.use('/api/admin', require('./routes/admin'));

// ─── Health Check ───
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── Start Server ───
async function start() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');

    // Sync all models (creates tables if they don't exist)
    await sequelize.sync({ alter: true });
    console.log('✅ Database synced');

    // Create session table
    sessionStore.sync();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err.message);
    process.exit(1);
  }
}

start();
