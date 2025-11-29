const User = require("../models/User");
const bcrypt = require("bcrypt");

module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // 1. Check if user already exists
    const usernameCheck = await User.findOne({ username });
    if (usernameCheck)
      return res.json({ msg: "Username already used", status: false });

    const emailCheck = await User.findOne({ email });
    if (emailCheck)
      return res.json({ msg: "Email already used", status: false });

    // 2. Encrypt the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Create the user in the Database
    const user = await User.create({
      email,
      username,
      password: hashedPassword,
    });

    // 4. Return the user (but remove the password for safety)
    const userResponse = user.toObject();
    delete userResponse.password;
    
    return res.json({ status: true, user: userResponse });
  } catch (ex) {
    next(ex);
  }
};

module.exports.login = async (req, res, next) => {
    try {
      // CHANGE 1: Destructure 'email' instead of 'username'
      const { email, password } = req.body;
      
      // CHANGE 2: Find user by 'email'
      const user = await User.findOne({ email });
      
      if (!user)
        return res.json({ msg: "Incorrect Email or Password", status: false });
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid)
        return res.json({ msg: "Incorrect Email or Password", status: false });
  
      delete user.password;
      return res.json({ status: true, user });
    } catch (ex) {
      next(ex);
    }
  };

  module.exports.getAllUsers = async (req, res, next) => {
    try {
      const users = await User.find({ _id: { $ne: req.params.id } }).select([
        "email",
        "username",
        "avatarImage",
        "_id",
      ]);
      return res.json(users);
    } catch (ex) {
      next(ex);
    }
  };