const router = require('express')();
const ctrl = require('./contact_ctrl');

router.use('/', (req, res, next) => {
  if (!req.session._id) {
    res.status(401);
    return res.json({ error: 'Session does not exist!'});
  }
  next();
});

router.get('/getContacts', ctrl.getContacts);

router.post('/addContact', ctrl.addContact);

module.exports = router;