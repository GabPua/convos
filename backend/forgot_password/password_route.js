const router = require('express')();
const ctrl = require('./password_ctrl');

router.get('/requestPasswordReset', ctrl.requestPasswordReset);

router.get('/checkToken', ctrl.checkToken);

router.post('/updatePassword', ctrl.updatePassword);

module.exports = router;