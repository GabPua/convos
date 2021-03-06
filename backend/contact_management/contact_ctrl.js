const Contact = require('./contact');
const User = require('../user_management/user');

const contact_ctrl = {
  getContacts: (req, res) => {
    Contact.find({ userId: req.session._id }, 'contactId').populate('contactId', 'name dpUri').exec()
      .then(contacts => res.json({ contacts: contacts.map(c => c.contactId) }));
  },

  addContact: async (req, res) => {
    const { contactId } = req.body;
    let user;

    if (contactId == req.session._id) {
      return res.json({ err: 'You cannot add yourself!'});
    }

    // check if user to be added does exist
    try {
      user = await User.findById(contactId).exec();
    } catch (err) {
      res.status(500);
      return res.json({ err });
    }

    if (!user) {
      return res.json({ err: 'User does not exist!' });
    }

    const contact = { userId: req.session._id, contactId };

    try {
      let record = await Contact.findOne(contact).exec();

      if (record) {
        res.json({ err: 'User is already in contacts!' });
      } else {
        Contact.create({ userId: req.session._id, contactId: user._id });
        res.json({ user });
      }
    } catch (err) {
      res.status(500);
      return res.json({ err });
    }
  }
};

module.exports = contact_ctrl;