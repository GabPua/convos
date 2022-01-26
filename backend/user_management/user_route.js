const router = require('express')();
const ctrl = require('./user_ctrl');

router.get('/checkEmail', ctrl.checkEmail);

router.post('/register', ctrl.register);

router.post('/login', ctrl.login);

router.get('/getUser', ctrl.getUser);

router.get('/getUser/:id', ctrl.getUser);

router.post('/forgotPassword', ctrl.forgotPassword);

router.post('/changePassword', ctrl.changePassword);

router.post('/updateName', ctrl.updateName);

router.post('/updateDp', ctrl.updateDp);

router.post('/logout', ctrl.logout);

router.delete('/reject/:groupId', ctrl.rejectInvitation);

module.exports = router;