const router = require('express')();
const ctrl = require('./convo_ctrl');

router.post('/:groupId/startConvo', ctrl.startConvo);

module.exports = router;