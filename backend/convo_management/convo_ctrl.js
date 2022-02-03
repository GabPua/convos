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

  joinConvo: async (req, res) => {
    const userId = req.session._id;
    const { convoId } = req.params;

    try {
      const convo = await Convo.findById(convoId).lean().exec();
      const group = await Group.findById(convo.group).lean().exec();

      if (userId in group.users) {
        await Convo.findByIdAndUpdate(convoId, { $addToSet: { users: userId } })
        return res.json({ result: true });
      }

      res.json({ result: false });
    } catch (err) {
      res.json({ err });
    }
  }
};

module.exports = convo_ctrl;