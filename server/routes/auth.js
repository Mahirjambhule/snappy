const {
    login,
    register,
    getAllUsers, // <--- Make sure this is imported
  } = require("../controllers/userController");
  
  const router = require("express").Router();
  
  router.post("/register", register);
  router.post("/login", login);
  
  // THIS IS THE MISSING LINE CAUSING THE 404 ERROR:
  router.get("/allusers/:id", getAllUsers);
  
  module.exports = router;