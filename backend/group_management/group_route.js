const router = require('express')();

module.exports = (io, users) => {
  const ctrl = require('./group_ctrl')(io, users);

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

  router.post('/:id/updateDetails', ctrl.updateDetails);

  router.post('/:id/updatePic', ctrl.updatePic);

  router.post('/:id/updateCover', ctrl.updateCover);

  router.put('/:id/invite', ctrl.inviteMembers);

  router.post('/:id/add', ctrl.addMember);

  router.post('/:id/remove', ctrl.removeMember);

  router.delete('/:id', ctrl.deleteGroup);

  return router;
};
