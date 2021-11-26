const Contact = require('./contact');

const contact_ctrl = {
  getContacts: (req, res) => {
    Contact.find({ userId: req.query._id }).exec()
      .then(contacts => res.json(contacts));
  },

  addContact: (req, res) => {
    const { userId, contactId } = req.body;
    const contact = { userId, contactId };
    
    Contact.create(contact, (err, result) => res.send({ result }));
  }
}

module.exports = contact_ctrl;