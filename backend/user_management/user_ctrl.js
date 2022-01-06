require('dotenv').config();
const User = require('./user');
const { isValidEmail, isValidName, isValidPassword, passwordErrorMessage } = require('convos-validator');
const { hashPassword, matchPassword } = require('../utils/hashPassword');

async function getUser(_id) {
  return await User.findById(_id).exec();
}

async function isUniqueEmail(email) {
  return await getUser(email).then(result => (result == null));
}

async function updatePassword(_id, password) {
  return await User.updateOne({ _id }, { ...hashPassword(password) });
}

const user_ctrl = {
  register: (req, res) => {
    const { _id, name, password } = req.body;

    // final check before creating account
    let isValid = isValidEmail(_id) && isValidName(name) && isValidPassword(password);

    isUniqueEmail(_id)
      .then(result => {
        if (isValid && result) {
          const user = { _id, name, groups: [], ...hashPassword(password) };
          User.create(user, (err, result) => {
            if (!err) {
              req.session._id = _id;
            }

            res.send({ result });
          });
          return;
        }

        res.json({ result: false });
      });
  },

  checkEmail: (req, res) => {
    const email = decodeURIComponent(req.query._id);
    isUniqueEmail(email)
      .then(result => res.json({ result }));
  },

  login: (req, res) => {
    const { _id, password } = req.body;

    getUser(_id)
      .then(user => {
        if (user !== null && matchPassword(password, user.password, user.salt)) {
          req.session._id = _id;
          req.session.name = user.name;
          res.status(200);
          res.json({
            _id,
            name: user.name,
            dpUri: user.dpUri,
          });
        } else {
          res.status(401);
          res.json({});
        }
      });
  },

  getUser: (req, res) => {
    getUser(req.session._id).then(user => {
      if (user) {
        res.json({
          _id: user._id,
          name: user.name,
          dpUri: user.dpUri,
        });
      } else {
        res.json({});
      }
    });
  },

  forgotPassword: (req, res) => {
    const { _id, password } = req.body;
    updatePassword(_id, password)
      .then(() => res.json({ result: true }))
      .catch(() => res.json({ result: false }));
  },

  updateName: (req, res) => {
    const _id = req.session._id;
    const { name } = req.body;

    if (_id && name) {
      User.updateOne({ _id }, { name }, (err) => res.json({ result: !err }));
    } else {
      res.status(400);
      res.json({ err: 'Bad Request: No session or new name passed.' });
    }
  },

  updateDp: (req, res) => {
    const _id = req.session._id;
    const { dpUri } = req.body;

    if (_id && dpUri) {
      User.updateOne({ _id }, { dpUri }, (err) => res.json({ result: !err }));
    } else {
      res.status(400);
      res.json({ err: 'Bad Request: No session or new URI passed.' });
    }
  },

  changePassword: (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const _id = req.session._id;

    User.findById(_id, (err, user) => {
      if (err) {
        return res.json({ old: err });
      }

      if (!matchPassword(oldPassword, user.password, user.salt)) {
        return res.json({ old: 'Invalid password' });
      }

      if (!isValidPassword(newPassword)) {
        return res.json({ new: passwordErrorMessage });
      }

      updatePassword(_id, newPassword)
        .then(() => res.json({ result: true }))
        .catch(() => res.json({ result: false }));
    });
  },

  logout: (req, res) => {
    res.clearCookie('sid');
    req.session.destroy((err) => {
      res.json({ err });
    });
  }
};

module.exports = user_ctrl;
