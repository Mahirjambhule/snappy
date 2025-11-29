const Messages = require("../models/messageModel");

module.exports.getMessages = async (req, res, next) => {
  try {
    const { from, to } = req.body;

    let query;
    if (req.body.groupId) {
       query = { groupId: req.body.groupId };
    } else {
       query = { users: { $all: [from, to] } };
    }

    const messages = await Messages.find(query)
      .sort({ updatedAt: 1 })
      .populate("sender", "username avatarImage");

    const projectedMessages = messages.map((msg) => {
      return {
        // CRITICAL UPDATE: We send the ID now
        id: msg._id, 
        fromSelf: msg.sender._id.toString() === from,
        message: msg.message.text,
        image: msg.message.image || "",
        sender: {
            username: msg.sender.username,
        } 
      };
    });
    res.json(projectedMessages);
  } catch (ex) {
    next(ex);
  }
};

module.exports.addMessage = async (req, res, next) => {
  try {
    const { from, to, message, groupId, image } = req.body;
    
    const msgData = {
      message: { 
        text: message || "", 
        image: image || ""
      },
      users: groupId ? [] : [from, to],
      groupId: groupId || null,
      sender: from,
    };

    const data = await Messages.create(msgData);

    if (data) return res.json({ msg: "Message added successfully." });
    else return res.json({ msg: "Failed to add message to database" });
  } catch (ex) {
    next(ex);
  }
};

// NEW FUNCTION: Delete Message
module.exports.deleteMessage = async (req, res, next) => {
  try {
    const { msgId } = req.body;
    if (!msgId) return res.json({ msg: "Message ID is required", status: false });
    
    await Messages.findByIdAndDelete(msgId);
    return res.json({ status: true, msg: "Message deleted successfully" });
  } catch (ex) {
    next(ex);
  }
};