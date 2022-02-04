require('dotenv').config();
const Group = require('./group');
const Member = require('./member');
const { isValidGroupName, groupNameErrorMessage } = require('convos-validator');

const group_ctrl = {
  createGroup: async (req, res) => {
    const { name, tag } = req.body;
    const userId = req.session._id;

    if (!isValidGroupName(name)) {
      return res.json({ result: false });
    }

    try {
      const { _id } = await Group.create({ name, admin: userId, tag });
      await Member.create({ group: _id, user: userId, accepted: true });
      res.json({ result: _id });
    } catch (err) {
      res.json({ err });
    }
  },

  getGroup: async (req, res) => {
    const groupId = req.params.id;
    try {
      const record = await Member.findOne({ group: groupId, user: req.session._id });

      if (!record) {
        throw new Error('User is not part of group!');
      }

      const group = await Group.findById(groupId).lean().exec();
      const members = await Member.find({ group: groupId }, '-_id user accepted').populate('user', 'name dpUri').lean().exec();
      group.members = members.map(m => {
        m.user.accepted = m.accepted;
        return m.user;
      });

      res.json({ result: true, group });
    } catch (err) {
      res.json({ result: false, err });
    }
  },

  getGroups: async (req, res) => {
    const groups = await Member.find({ user: req.session._id }, '-_id group accepted')
      .populate({
        path: 'group', 
        populate: {
          path: 'memCount'
        },
        select: '-__v'
      })
      .lean({ virtuals: true }).exec();

    const temp = groups.map(g => {
      g.group.accepted = g.accepted;
      delete g.id;
      return g.group;
    });

    res.json({ groups: temp });
  },

  updateDetails: (req, res) => {
    if (req.body?.name && !isValidGroupName(req.body.name)) {
      return res.json({ err: groupNameErrorMessage });
    }
    Group.updateOne({ _id: req.params.id }, req.body, (err) => res.json({ result: !err }));
  },

  inviteMembers: async (req, res) => {
    const { userIds } = req.body;
    const groupId = req.params.id;

    try {
      // get group admin
      const { admin } = await Group.findById(groupId, 'admin').lean().exec();

      // verify current user is admin
      if (req.session._id !== admin) {
        res.status(401);
        return res.json({ result: false, error: 'Current user is unauthorized!' });
      }

      const bulkOp = userIds.map(id => {
        return {
          updateOne: {
            filter: { group: groupId, user: id },
            update: { $set: { group: groupId, user: id, accepted: false } },
            upsert: true,
          }
        };
      });

      const { ok } = await Member.bulkWrite(bulkOp);
      if (ok) {
        res.json({ result: true });
      } else {
        throw new Error('No users were invited!');
      }
    } catch (err) {
      console.log(err);
      res.json({ result: false, err });
    }
  },

  addMember: async (req, res) => {
    const groupId = req.params.id;

    try {
      const { modifiedCount } = await Member.updateOne({ group: groupId, user: req.session._id }, { accepted: true });
      if (modifiedCount) {
        res.json({ result: true });
      } else {
        throw new Error('An error has occured! No document was modified.');
      }
    } catch (error) {
      res.json({ result: false, error });
    }
  },

  removeMember: async (req, res) => {
    const { userId } = req.body;
    const groupId = req.params.id;

    try {
      const result = await Group.findById(groupId, 'admin').lean().exec();
      const inGroup = await Member.findOne({ group: groupId, user: userId });

      // if user to be removed is part of group and not an admin
      if (inGroup && userId !== result.admin) {
        // if logged in user is admin or user removing himself
        if (req.session._id === result.admin || req.session._id === userId) {
          await Member.deleteOne({ group: groupId, user: userId });
          return res.json({ result: true });
        }
      }

      res.status(401);
      throw Error('Unauthorized!');
    } catch (error) {
      res.json({ result: false, error });
    }
  },

  deleteGroup: (req, res) => {
    Group.deleteOne({ _id: req.params.id, admin: req.session._id }, (err) => res.json({ result: !err }));
  }
};

module.exports = group_ctrl;