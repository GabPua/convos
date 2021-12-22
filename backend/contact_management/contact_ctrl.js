const Contact = require('./contact');

const contact_ctrl = {
  getContacts: (req, res) => {
    const userId = decodeURIComponent(req.query._id);
    Contact.find({ userId }).exec()
      .then(contacts => res.json(contacts));
  },

  addContact: (req, res) => {
    const { userId, contactId } = req.body;
    const contact = { userId, contactId };
    
    Contact.create(contact, (err, result) => res.send({ result }));
  }
};

module.exports = contact_ctrl;