const router = require('express')();
const ctrl = require('./user_ctrl');

router.get('/checkEmail', ctrl.checkEmail);

router.post('/register', ctrl.register);

router.get('/getUser', ctrl.getUser);

router.patch('/updatePassword', ctrl.updatePassword);

module.exports = router;