const User = require('./user');
const { isValidEmail, isValidName, isValidPassword } = require('convos-validator');
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
      .then(user => matchPassword(password, user.password, user.salt))
      .then(result => {
        if (result) {
          req.session._id = _id;
        }
        res.json({ result });
      });
  },

  getUser: (req, res) => {
    getUser(req.session._id).then(user => {
      if (user) {
        res.json({
          _id: user._id,
          name: user.name,
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
        return res.json({ new: 'Password must contain' }); // TODO: Error message
      }

      updatePassword(_id, newPassword)
        .then(() => res.json({ result: true }))
        .catch(() => res.json({ result: false }));
    });
  },

  logout: (req, res) => {
    req.session.destroy((err) => {
      req.session = null;
      res.json({ err });
    });
  }
}; 

module.exports = user_ctrl;
