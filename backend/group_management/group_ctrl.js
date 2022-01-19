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

  updateName: (req, res) => {
    const { _id, name } = req.body;

    if (!isValidGroupName(name)) {
      res.json({ err: 'Invalid name' }); // TODO: Change error message as needed
      return;
    }

    Group.updateOne({ _id }, { name }, (err) => res.json({ result: !err }));
  },

  updatePic: (req, res) => {
    const { _id, picUri } = req.body;
    Group.updateOne({ _id }, { picUri }, (err) => res.json({ result: !err }));
  },

  updateTag: (req, res) => {
    const { _id, tag } = req.body;
    Group.updateOne({ _id }, { tag }, (err) => res.json({ result: !err }));
  },

  addMember: (req, res) => {
    const { userId } = req.body;
    const groupId = req.params.id;
    const group = await Group.findById(groupId).lean().exec();
    
    const members = group.members;
    if (members.includes(userId)) {
      res.json({ result: false });
      return;
    }

    members.push(userId);
    Group.updateOne({ _id: groupId }, { members }, (err) => {
      if (!err) {
        const user = await User.findById(userId).lean().exec();
        const groups = user.groups;
        groups.push(groupId);

        User.updateOne({ _id: userId }, { groups }, (err) => res.json({ result: !err }));
        return;
      }
      
      res.json({ result: false });
    });
  }
};

module.exports = group_ctrl;