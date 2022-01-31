const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const inProduction = process.env.NODE_ENV === 'production';

const { createServer } = require('http');
const { Server } = require('socket.io');

// session dependencies
const cookieParser = require('cookie-parser');
const session = require('express-session');
const mongoStore = require('connect-mongodb-session')(session);

require('dotenv').config();
const dbUri = process.env.SERVER_DB_URI;
const secret = process.env.SECRET;
const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true
};

mongoose.connect(dbUri, options, (err) => {
  console.log(err ? err : 'Established connection with mongodb!');
});

// storage for user sessions
const store = new mongoStore({
  uri: dbUri,
  databaseName: 'convos',
  collection: 'session',
});

store.on('error', err => console.log(err.message));

const app = express();
app.set('port', (process.env.PORT || 3001));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use('/', express.static(path.join(__dirname, 'public')));

const corsOptions = {
  origin: inProduction ? '' : 'http://localhost:3000',
  credentials: true,
};

// configure cors
app.use(cors(corsOptions));

// configure user session
app.use(session({
  key: 'sid',
  secret,
  resave: false,
  saveUninitialized: false,
  rolling: true,  // refresh cookie age
  cookie: {
    maxAge: 18144e5 // three weeks
  },
  store,
}));

app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

// socket setup
const BiMap = require('bidirectional-map');
const users = new BiMap();

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: corsOptions,
});

io.on('connection', socket => {
  users.set(socket.handshake.auth._id, socket.id);

  socket.on('join room', groupId => socket.join(groupId));
  socket.on('leave room', groupId => socket.leave(groupId));

  socket.on('disconnect', () => {
    users.deleteValue(socket._id);
  });
});

io.on('connect_error', err => { console.log(err.message); });

const user_route = require('./user_management/user_route');
const password_route = require('./forgot_password/password_route');
const contact_route = require('./contact_management/contact_route');
const storage_route = require('./cloud_storage/storage_route');
const group_route = require('./group_management/group_route')(io, users);

app.use('/api/user', user_route);
app.use('/api/password', password_route);
app.use('/api/contact', contact_route);
app.use('/api/storage', storage_route);
app.use('/api/group', group_route);

httpServer.listen(app.get('port'));
