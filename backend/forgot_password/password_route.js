const router = require('express')();
const ctrl = require('./password_ctrl');

router.get('/requestPasswordReset', ctrl.requestPasswordReset);

router.get('/checkToken', ctrl.checkToken);

module.exports = router;