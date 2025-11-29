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

    // UPDATED LINE: We added .populate() to get the username of the sender
    const messages = await Messages.find(query)
      .sort({ updatedAt: 1 })
      .populate("sender", "username avatarImage");

      const projectedMessages = messages.map((msg) => {
        return {
          fromSelf: msg.sender._id.toString() === from,
          message: msg.message.text,
          image: msg.message.image || "", // NEW: Send image URL
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
      // NEW: Accept 'image' from req.body
      const { from, to, message, groupId, image } = req.body; 
      
      let data;
      const msgData = {
          message: { 
              text: message || "", // Text can be empty if there's an image
              image: image || ""   // Save image URL
          },
          users: groupId ? [] : [from, to],
          groupId: groupId || null,
          sender: from,
      };
  
      data = await Messages.create(msgData);
  
      if (data) return res.json({ msg: "Message added successfully." });
      else return res.json({ msg: "Failed to add message to database" });
    } catch (ex) {
      next(ex);
    }
  };