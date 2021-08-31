'use strict';

// load modules
const express = require('express');
const { asyncHandler } = require('../middleware/async-handler');
const { User } = require('../models');
const { authenticateUser } = require("../middleware/auth-user");

// Construct a router instance.
const router = express.Router();

// Route that returns a list of users.
router.get("/users", authenticateUser, asyncHandler(async (req, res) => {
  const user = await User.findAll({
    where: { id: req.currentUser.id },
    attributes: { 
      exclude: [
        "createdAt", 
        "updatedAt", 
        "password"
      ] 
    }
  });
  console.log(user);
  if (user) {
    res.json(user);
  } else {
    res.status(400).json({ message: "User not found" });
  }
}));

// Route that creates a new user.
router.post("/users", asyncHandler(async (req, res) => {
  try {
    await User.create(req.body);
    res.status(201).location("/").end();
  } catch (error) {
    console.log("Error ", error.name);

    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const errors = error.errors.map(err => err.message);
      res.status(400).json({ errors });   
    } else {
      throw error;
    }
  }
}));

module.exports = router;