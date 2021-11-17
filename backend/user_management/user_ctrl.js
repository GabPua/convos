const User = require('./user');
const { isValidEmail, isValidName, isValidPassword } = require('convos-validator')

async function isUniqueEmail(email) {
    return await User.findById(email, '_id', null).exec()
        .then(result => (result == null));
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
                    return
                }
                let user = { _id, name, password, groups: [] };
                User.create(user, (err, result) => res.send({ result }));
            })
    },

    checkEmail: (req, res) => {
        let email = req.query._id;
        isUniqueEmail(email)
            .then(result => res.json({result: result}));
    }
}

module.exports = user_ctrl;