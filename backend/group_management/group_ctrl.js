require('dotenv').config();
const Group = require('./group');
const User = require('../user_management/user');
const { isValidGroupName } = require('convos-validator');

const group_ctrl = {
  createGroup: (req, res) => {
    const { name, tag } = req.body;
    const userId = req.session._id;
    
    if (!isValidGroupName(name)) {
      res.json({ result: false });
      return;
    }

    let group = {
      name,
      admin: userId,
      members: [userId],
      tag
    };

    Group.create(group, async (err, result) => {
      if (!err) {
        const _id = result._id;
        const user = await User.findById(userId).lean().exec();
        const groups = user.groups;
        groups.push(_id);

        User.updateOne({ _id: userId }, { groups })
          .then(() => res.json({ result: _id }));
      } else {
        res.json({ err });
      }
    });
  },

  getGroup: async (req, res) => {
    const group = await Group.findById(req.params.id).lean().exec();
    res.json(group);
  },

  getGroups: async (req, res) => {
    const { groups } = await User.findById(req.session._id, 'groups').populate('groups', 'name members picUri tag').lean().exec();
    
    for (let i = 0; i < groups.length; i++) {
      groups[i].members = groups[i].members.length;
    }

    res.json(groups);
  },
};

module.exports = group_ctrl;