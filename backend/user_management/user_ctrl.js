const dotenv = require('dotenv');
const crypto = require('crypto-js');
const User = require('./user');
const { isValidEmail, isValidName, isValidPassword } = require('convos-validator');

dotenv.config();
const salt = process.env.SALT;

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
                isValid = isValid && result;
                if (!isValid) { // inputs are invalid
                    res.json({ result: true });
                }
                let user = {
                    _id, 
                    name, 
                    password: crypto.AES.encrypt(password, salt).toString(), 
                    groups: [] 
                };
                User.create(user, (err, result) => res.send({ result }));
            })
    },

    checkEmail: (req, res) => {
        const email = req.query._id;
        isUniqueEmail(email)
            .then(result => res.json({result: result}));
    },

    getUser: (req, res) => {
        const { _id } = req.query;
        getUser(_id)
            .then(result => {
                result.password = crypto.AES.decrypt(result.password, salt).toString(crypto.enc.Utf8);
                return result;
            })
            .then(result => res.json(result));
    }
}

module.exports = user_ctrl;