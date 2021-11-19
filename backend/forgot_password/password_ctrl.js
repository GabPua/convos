const dotenv = require('dotenv');
const crypto = require('crypto');
const cryptojs = require('crypto-js');
const Token = require('./token');

dotenv.config();
const salt = process.env.SALT;

const password_ctrl = {
    requestPasswordReset: (req, res) => {
        const email = req.query._id;

        Token.findOneAndDelete({ userId: email }, (err) => {
            let resetToken = crypto.randomBytes(32).toString("hex"); // generate random token
            const tokenHash = cryptojs.AES.encrypt(resetToken, salt).toString(); // encrypt token
            const emailHash = cryptojs.AES.encrypt(email, salt).toString(); // encrypt email

            let token = {
                userId: email,
                token: tokenHash,
                createdAt: Date.now()
            };

            Token.create(token, (err) => {
                const link = `http://localhost:3000/reset?token=${resetToken}&user=${emailHash}`;
                // TODO: send email here

                let result = true;
                res.json({ result: result });
            });
        });
    },

    checkToken: (req, res) => {
        const token = req.query.token;
        const emailHash = req.query.user;
        const email = cryptojs.AES.decrypt(emailHash, salt).toString(cryptojs.enc.Utf8); // decrypt email

        Token.findOne({ userId: email }).exec()
            .then(result => {
                if (result == null) {
                    return false;
                } else {
                    // compare tokens
                    return cryptojs.AES.decrypt(result.token, salt).toString(cryptojs.enc.Utf8) === token;
                }
            })
            .then(result => res.json({ result: result, email: email }));
    }
}

module.exports = password_ctrl;