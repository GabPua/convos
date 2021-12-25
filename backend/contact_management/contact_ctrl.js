const Contact = require('./contact');

const contact_ctrl = {
  getContacts: (req, res) => {
    Contact.find({ userId: req.session._id }, 'contactId').populate('contactId', 'name dpUri').exec()
      .then(contacts => res.json(contacts.map(c => c.contactId)));
  },

  addContact: (req, res) => {
    const { contactId } = req.body;
    const contact = { userId: req.session._id, contactId };
    Contact.create(contact, (err, result) => res.send({ result }));
  }
};

module.exports = contact_ctrl;