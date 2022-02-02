require('dotenv').config();
const Group = require('./group');
const User = require('../user_management/user');
const { isValidGroupName, groupNameErrorMessage } = require('convos-validator');

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
      invitations: [],
      convos: [],
      tag
    };

    Group.create(group, async (err, result) => {
      if (!err) {
        const _id = result._id;
        User.updateOne({ _id: userId }, { $push: { groups: _id } })
          .then(() => res.json({ result: _id }));
      } else {
        res.json({ err });
      }
    });
  },

  getGroup: async (req, res) => {
    const group = await Group.findOne({ _id: req.params.id, members: req.session._id })
      .populate('members', 'name dpUri')
      .populate('invitations', 'name dpUri')
      .lean().exec();
    res.json({ group });
  },

  getGroups: async (req, res) => {
    const { groups, invitations } = await User.findById(req.session._id, 'groups invitations')
      .populate('groups', 'name members picUri tag coverUri admin')
      .populate('invitations', 'name picUri')
      .lean().exec();

    for (let i = 0; i < groups.length; i++) {
      groups[i].members = groups[i].members.length;
    }

    res.json({ groups, invitations });
  },

  updateDetails: (req, res) => {
    if (!isValidGroupName(req.body.name)) {
      return res.json({ err: groupNameErrorMessage });
    }

    Group.updateOne({ _id: req.params.id }, req.body, (err) => res.json({ result: !err }));
  },

  updatePic: (req, res) => {
    const { picUri } = req.body;
    Group.updateOne({ _id: req.params.id }, { picUri }, (err) => res.json({ result: !err }));
  },

  updateCover: (req, res) => {
    const { coverUri } = req.body;
    Group.updateOne({ _id: req.params.id }, { coverUri }, (err) => res.json({ result: !err }));
  },

  inviteMembers: async (req, res) => {
    const { userIds } = req.body;
    const groupId = req.params.id;

    try {
      // get group admin and members
      const { members, admin } = await Group.findById(groupId, 'members admin').lean().exec();

      // verify current user is admin
      if (req.session._id !== admin) {
        res.status(401);
        return res.json({ result: false, error: 'Current user is unauthorized!' });
      }

      // filter members not included in the group
      const filteredIds = userIds.filter(id => !members.includes(id));

      const { matchedCount } = await User.updateMany({ _id: { $in: filteredIds } }, { $addToSet: { invitations: groupId } }).exec();
      if (matchedCount) {
        await Group.updateOne({ _id: groupId }, { $push: { invitations: filteredIds } });
        res.json({ result: true });
      } else {
        res.json({ result: false, error: 'No users were invited!' });
      }
    } catch (err) {
      console.log(err);
      res.json({ result: false, err });
    }
  },

  addMember: async (req, res) => {
    const groupId = req.params.id;

    try {
      const result = await User.updateOne({ _id: req.session._id, invitations: groupId },
        { $pull: { invitations: groupId }, $push: { groups: groupId } }).exec();

      // if the user is invited to the group
      if (result.modifiedCount == 1) {
        await Group.findByIdAndUpdate(groupId, { 
          $addToSet: { members: req.session._id }, 
          $pull: { invitations: req.session._id } }).lean().exec();
        res.json({ result: true });
      } else {
        res.json({ result: false, error: 'An error has occured!' });
      }
    } catch (error) {
      res.json({ result: false, error });
    }
  },

  removeMember: async (req, res) => {
    const { userId } = req.body;

    try {
      const result = await Group.findOne({ _id: req.params.id, $or: [{members: userId}, { invitations: userId }] }, 'admin').lean().exec();

      // if user is part of group and not an admin removing himself
      if (result && userId !== result.admin) {
        // if logged in user is admin or user removing himself
        if (req.session._id === result.admin || req.session._id === userId) {
          await Group.updateOne({ _id: result._id }, { $pull: { members: userId, invitations: userId }, });
          await User.updateOne({ _id: userId }, { $pull: { groups: req.params.id, invitations: req.params.id }, });
          return res.json({ result: true });
        }
      }

      res.status(401);
      res.json({ result: false, error: 'Unauthorized' });
    } catch (error) {
      res.json({ result: false, error });
    }
  },

  deleteGroup: (req, res) => {
    Group.deleteOne({ _id: req.params.id, admin: req.session._id }, (err) => res.json({ result: !err }));
  }
};

module.exports = group_ctrl;