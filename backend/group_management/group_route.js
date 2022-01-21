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

router.post('/updateName', ctrl.updateName);

router.post('/updatePic', ctrl.updatePic);

router.post('/updateTag', ctrl.updateTag);

router.post('/:id/add', ctrl.addMember);

router.post('/:id/remove', ctrl.removeMember);

router.delete('/:id', ctrl.deleteGroup);

module.exports = router;