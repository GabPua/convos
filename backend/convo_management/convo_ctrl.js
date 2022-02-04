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

    Convo.create(convo, (err) => res.json({ result: !err, err }));
  },

  joinConvo: async (req, res) => {
    const userId = req.session._id;
    const { convoId } = req.params;

    try {
      const convo = await Convo.findById(convoId).lean().exec();
      const group = await Group.findOne({ _id: convo.group, users: userId }).lean().exec();

      if (group) {
        await Convo.findByIdAndUpdate(convoId, { $addToSet: { users: userId } });
        return res.json({ result: true });
      }

      res.json({ result: false, err: 'User not part of group!' });
    } catch (err) {
      res.json({ err });
    }
  },

  deleteConvo: async (req, res) => {
    try {
      await Convo.deleteOne({ _id: req.params.convoId, creator: req.session._id });
      res.json({ result: true });
    } catch (err) {
      res.json({ result: false, err });
    }
  },
};

module.exports = convo_ctrl;