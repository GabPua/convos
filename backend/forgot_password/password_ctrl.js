const dotenv = require('dotenv');
const { randomBytes } = require('crypto');
const Token = require('./token');
const { sendPasswordReset } = require('../utils/email/sendEmail');
const ObjectId = require('mongoose').Types.ObjectId;

dotenv.config();

const password_ctrl = {
  requestPasswordReset: (req, res) => {
    const email = req.query._id;

    Token.findOneAndDelete({ userId: email }, () => {
      const tokenString = randomBytes(16).toString('hex'); // generate random token

      let myToken = {
        userId: email,
        token: tokenString,
      };

      Token.create(myToken, async (err, token) => {
        let result = false;
        try {
          if (!err) {
            // TODO: how to set domain???
            await sendPasswordReset(email, `http://localhost:3000/reset?token=${tokenString}&id=${token._id}`);
            result = true;
          }
        } finally {
          res.json({ result });
        }
      });
    });
  },

  checkToken: (req, res) => {
    const { token, id } = req.query;

    if (ObjectId.isValid(id) && ObjectId(id).toString() === id) {
      Token.findById(id).exec()
        .then(result => {
          let verified = result != null && result.token === token;
          let json = { result: verified };

          if (verified) {
            json.email = result.userId;
          }
          res.json(json);
        });
    } else {
      res.json({ result: false });
    }
  }
};

module.exports = password_ctrl;