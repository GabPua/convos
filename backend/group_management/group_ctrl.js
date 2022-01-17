require('dotenv').config();
const Group = require('./group');
const User = require('../user_management/user');
const { isValidGroupName } = require('convos-validator');

const group_ctrl = {
  createGroup: (req, res) => {
    const { userId, name, tag } = req.body;
    
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
        const user = await User.findById(userId).exec();
        const groups = user.groups;
        groups.push(_id);

        User.updateOne({ userId }, { groups })
          .then(() => res.send(result));
      }
    });
  }
};

module.exports = group_ctrl;