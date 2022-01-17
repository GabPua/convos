const router = require('express')();
const ctrl = require('./group_ctrl');

router.post('/createGroup', ctrl.createGroup);