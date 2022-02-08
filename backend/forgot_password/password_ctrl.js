const dotenv = require('dotenv');
const { randomBytes } = require('crypto');
const Token = require('./token');
const util = require('../utils/email/sendEmail');
const ObjectId = require('mongoose').Types.ObjectId;

dotenv.config();

const password_ctrl = {
  requestPasswordReset: (req, res) => {
    const email = decodeURIComponent(req.query._id);
    const token = randomBytes(16).toString('hex'); // generate random token

    Token.findOneAndUpdate({ userId: email }, { token }, { upsert: true }, async (err, doc) => {
      try {
        if (err) throw err;
        
        await util.sendPasswordReset(email, `http://localhost:3000/reset?token=${token}&id=${doc._id}`);
        res.json({ result: true });
      } catch (error) {
        res.json({ result: false, error });
      }
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