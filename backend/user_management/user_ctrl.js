const User = require('./user');
const { isValidEmail, isValidName, isValidPassword } = require('convos-validator');
const { randomBytes, createHmac } = require('crypto');

async function getUser(_id) {
  return await User.findById(_id).exec();
}

async function isUniqueEmail(email) {
  return await getUser(email).then(result => (result == null));
}

const user_ctrl = {
  register: (req, res) => {
    const { _id, name, password } = req.body;

    // final check before creating account
    let isValid = isValidEmail(_id) && isValidName(name) && isValidPassword(password);

    isUniqueEmail(_id)
      .then(result => {
        if (isValid && result) {
          const user = { _id, name, password, groups: [] };
          User.create(user, (err, result) => res.send({ result }));
          return;
        }

        res.json({ result: false });
      })
  },

  checkEmail: (req, res) => {
    isUniqueEmail(req.query._id)
      .then(result => res.json({ result }));
  },

  login: (req, res) => {
    const { _id, password } = req.query;
    getUser(_id)
      .then(user => {
        const salt = user.salt;
        return createHmac('sha512', salt).update(password).digest('hex') === user.password;
      })
      .then(result => res.json({ result }));
  },

  getUser: (req, res) => {
    getUser(req.query._id).then(user => res.json(user));
  },

  updatePassword: (req, res) => {
    const { _id, password } = req.body;
    const salt = randomBytes(32).toString('hex');
    const newPassword = createHmac('sha512', salt).update(password).digest('hex');

    User.updateOne({ _id }, { password: newPassword, salt }, (err, result) => {
      res.send({ result: true });
    });
  }
}

module.exports = user_ctrl;