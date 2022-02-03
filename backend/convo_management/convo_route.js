const router = require('express')();
const ctrl = require('./convo_ctrl');

router.post('/:groupId/startConvo', ctrl.startConvo);

router.post('/join/:convoId', ctrl.joinConvo);

module.exports = router;