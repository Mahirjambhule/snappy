const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); // Import JWT

// Helper function to create token
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d", // Token valid for 30 days
  });
};

module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const usernameCheck = await User.findOne({ username });
    if (usernameCheck)
      return res.json({ msg: "Username already used", status: false });
    const emailCheck = await User.findOne({ email });
    if (emailCheck)
      return res.json({ msg: "Email already used", status: false });
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      username,
      password: hashedPassword,
    });

    const userResponse = user.toObject();
    delete userResponse.password;

    // GENERATE TOKEN
    const token = createToken(user._id);
    
    // Send token inside the user object (or separate, but this is easiest for your current frontend)
    userResponse.token = token; 

    return res.json({ status: true, user: userResponse });
  } catch (ex) {
    next(ex);
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.json({ msg: "Incorrect Username or Password", status: false });
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.json({ msg: "Incorrect Username or Password", status: false });
    
    const userResponse = user.toObject(); // Convert to object to modify it
    delete userResponse.password;

    // GENERATE TOKEN
    const token = createToken(user._id);
    userResponse.token = token;

    return res.json({ status: true, user: userResponse });
  } catch (ex) {
    next(ex);
  }
};

// ... getAllUsers remains the same for now, we will protect it in routes
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