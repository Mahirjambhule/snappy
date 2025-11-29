const Group = require("../models/groupModel");

module.exports.createGroup = async (req, res, next) => {
  try {
    const { name, members, admin } = req.body;
    // members should be an array of User IDs. We add the admin to it as well.
    const group = await Group.create({
      name,
      members: [...members, admin], 
      admin,
    });
    return res.json({ status: true, group });
  } catch (ex) {
    next(ex);
  }
};

module.exports.getUserGroups = async (req, res, next) => {
  try {
    const userId = req.params.id;
    // Find all groups where the 'members' array contains this userId
    const groups = await Group.find({
      members: { $in: [userId] },
    });
    return res.json(groups);
  } catch (ex) {
    next(ex);
  }
};