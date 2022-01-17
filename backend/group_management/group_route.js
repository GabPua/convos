const router = require('express')();
const ctrl = require('./group_ctrl');

router.use('/', (req, res, next) => {
  if (!req.session._id) {
    res.status(401);
    return res.json({ error: 'Session does not exist!'});
  }
  next();
});

router.post('/createGroup', ctrl.createGroup);

router.get('/all', ctrl.getGroups);

router.get('/:id', ctrl.getGroup);

module.exports = router;