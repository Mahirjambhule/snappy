const jwt = require("jsonwebtoken");

module.exports.protect = async (req, res, next) => {
  let token;

  // 1. Check if the Authorization header exists and starts with "Bearer"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get the token string (remove "Bearer " part)
      token = req.headers.authorization.split(" ")[1];

      // Verify the token using your secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach the user's ID to the request object
      req.userId = decoded.id;

      // SUCCESS: Move to the next controller
      return next(); 

    } catch (error) {
      console.error("Token verification failed:", error.message);
      // ERROR: Token exists but is invalid/expired
      return res.status(401).json({ msg: "Not authorized, token failed" });
    }
  }

  // 2. If no token was found in the header at all
  if (!token) {
    return res.status(401).json({ msg: "Not authorized, no token" });
  }
};