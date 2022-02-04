const router = require('express')();
const ctrl = require('./convo_ctrl');

// router.get('/all', ctrl.getConvos);

router.post('/:groupId/startConvo', ctrl.startConvo);

router.post('/join/:convoId', ctrl.joinConvo);

router.delete('/:convoId', ctrl.deleteConvo);

module.exports = router;