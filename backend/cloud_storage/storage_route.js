const router = require('express')();
const ctrl = require('./storage_ctrl');

router.use('/details', ctrl.getDetails);

router.post('/sign', ctrl.signRequest);

module.exports = router;