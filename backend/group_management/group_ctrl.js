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
    const group = await Group.findById(req.params.id).populate('members', 'name dpUri').lean().exec();
    res.json({ group });
  },

  getGroups: async (req, res) => {
    const { groups } = await User.findById(req.session._id, 'groups').populate('groups', 'name members picUri tag coverUri').lean().exec();
    
    for (let i = 0; i < groups.length; i++) {
      groups[i].members = groups[i].members.length;
    }

    res.json({ groups });
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
    const { picUri } = req.body;
    Group.updateOne({ _id: req.params.id }, { picUri }, (err) => res.json({ result: !err }));
  },

  updateTag: (req, res) => {
    const { _id, tag } = req.body;
    Group.updateOne({ _id }, { tag }, (err) => res.json({ result: !err }));
  },

  addMember: async (req, res) => {
    const { userId } = req.body;
    const groupId = req.params.id;

    try {
      const result = await Group.updateOne({ _id: groupId, admin: req.session._id }, { $addToSet: { members: userId } }).exec();
      if (result.matchedCount == 1) {
        const user = await User.findOneAndUpdate({ _id: userId }, { $addToSet: { groups: groupId } }).exec();
        res.json({ result: true, user });
      } else {
        res.json({ result: false, error: 'An error has occured!'});
      }
    } catch (error) {
      res.json({ result: false, error });
    }
  },

  removeMember: async (req, res) => {
    const { userId } = req.body;

    try {
      const result = await Group.updateOne({ _id: req.params.id, admin: req.session._id }, { $pull: { members: userId } });

      // make sure that person is removed from group first by admin
      if (result.matchedCount == 1) {
        await User.updateOne({ _id: userId }, { $pull: { groups: req.params.id } });
        return res.json({ result: true });
      }
    } catch (error) {
      res.json({ result: false, error });
    }
  },

  deleteGroup: (req, res) => {
    Group.deleteOne({ _id: req.params.id, admin: req.session._id }, (err) => res.json({ result: !err }));
  }
};

module.exports = group_ctrl;