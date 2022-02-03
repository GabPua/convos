require('dotenv').config();
const Convo = require('./convo');
const Group = require('../group_management/group');
const { isValidTopicName } = require('convos-validator');

const convo_ctrl = {
  startConvo: (req, res) => {
    const { topic, link } = req.body;
    const { groupId } = req.params;

    if (!isValidTopicName(topic)) {
      res.json({ result: false });
      return;
    }

    let convo = {
      topic,
      link,
      group: groupId,
      creator: req.session._id,
      users: []
    };

    Convo.create(convo, (err, result) => {
      if (!err) {
        const _id = result._id;
        Group.updateOne({ _id: groupId }, { $push: { convos: _id } })
          .then(() => { res.json({ result: _id }) });
      } else {
        res.json({ err });
      }
    });
  },

  joinConvo: (req, res) => {
    Convo.findByIdAndUpdate(req.params.convoId, { $addToSet: { users: req.session._id } })
      .then(() => { res.json({ result: true }) })
      .catch(() => { res.json({ result: false }) });
  }
};

module.exports = convo_ctrl;