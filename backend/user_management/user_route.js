const router = require('express')();
const ctrl = require('./user_ctrl');

router.get('/checkEmail', ctrl.checkEmail);

router.post('/register', ctrl.register);

router.post('/login', ctrl.login);

router.get('/getUser', ctrl.getUser);

router.post('/forgotPassword', ctrl.forgotPassword);

router.post('/changePassword', ctrl.changePassword);

router.post('/updateName', ctrl.updateName);

module.exports = router;