const User = require('./user');

/* temp password checker */
function isValidPassword(pw) {
    const re = /\d/g;

    if (pw == null || pw.trim() === '') {
        return false;
    } else {
        return re.test(pw);
    }
}

function isValidName(name) {
    return !(name == null || name === '');
}

function isValidEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    
    return re.test(String(email).toLowerCase());
}

async function isUniqueEmail(email) {
    return await User.findById(email, '_id', null).exec()
        .then(result => (result == null));
}

const user_ctrl = {
    register: (req, res) => {
        const { email, name, password } = req.body;

        // final check before creating account
        let isValid = isValidEmail(email) && isValidName(name) && isValidPassword(password);
        
        isUniqueEmail(email)
            .then(result => {
                isValid = isValid && result;
                if (!isValid) { // inputs are invalid
                    res.send(false); 
                }
        
                let user = {
                    _id: email,
                    name: name,
                    password: password,
                    groups: []
                };
        
                User.create(user, (err, result) => {
                    if (err) {
                        res.send(null);
                    } else {
                        res.send(result);
                    }
                });
            })
    },

    checkEmail: (req, res) => {
        let email = req.query._id;
        isUniqueEmail(email)
            .then(result => res.json({result: result}));
    }
}

module.exports = user_ctrl;