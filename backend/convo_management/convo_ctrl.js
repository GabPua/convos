require('dotenv').config();
const Convo = require('./convo');
const Group = require('../group_management/group');
const { isValidTopicName } = require('convos-validator');
const Member = require('../group_management/member');

const convo_ctrl = {
  startConvo: (req, res) => {
    const { topic, link } = req.body;
    const { groupId } = req.params;

    if (!isValidTopicName(topic)) {
      return res.json({ result: false });
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

  getConvos: async (req, res) => {
    const groups = await Member.find({ user: req.session._id, accepted: true }, '-_id group').exec();
    const temp = groups.map(g => g.group);
    const convos = await Convo.find({ group: { $in: temp } }).populate('group', 'name picUri coverUri count').lean({ virtuals: true }).exec();
    res.json({ result: true, convos });
  },

  joinConvo: async (req, res) => {
    const userId = req.session._id;
    const { convoId } = req.params;

    try {
      const convo = await Convo.findById(convoId, '-_id group').lean().exec();
      const group = await Group.findOne({ _id: convo.group, users: userId }).lean().exec();

      if (group) {
        const { count } = await Convo.findByIdAndUpdate(convoId, { $addToSet: { users: userId }, createdAt: Date.now() }, 
          { new: true }).lean({ virtuals: true }).exec();
        console.log(count);
        return res.json({ result: true, count });
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