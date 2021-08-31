"use strict";

// load modules
const express = require("express");
const { User } = require("../models");
const { Course } = require("../models");
const { asyncHandler } = require("../middleware/async-handler");
const { authenticateUser } = require("../middleware/auth-user");
const router = express.Router();

router.get("/courses", asyncHandler(async (req, res) => {
  const courses = await Course.findAll({
    include: [
      {
        model: User,
        as: "userInfo",
        attributes: { 
          exclude: [
            "createdAt", 
            "updatedAt", 
            "password"
          ] 
        },
      },
    ],
    attributes: { 
      exclude: [
        "createdAt", 
        "updatedAt"
      ] 
    },
  });
  res.json(courses);
}));

router.get("/courses/:id", asyncHandler(async (req, res) => {
  const course = await Course.findByPk(req.params.id, {
    include: [
      {
        model: User,
        as: "userInfo",
        attributes: {
          exclude: [
            "createdAt",
            "updatedAt",
            "password"
          ]
        }
      }
    ],
    attributes: {
      exclude: [
        "createdAt",
        "updatedAt"
      ]
    }
  })

  if (course) {
    res.json(course);
  } else {
    res.status(404).json({ 
      message: "The requested Course was not found" 
    });
  }
}));

router.post("/courses", authenticateUser, asyncHandler(async (req, res) => {
  try {
    req.body.userId = req.currentUser.id;

    const course = await Course.create(req.body);
    res.status(201).location(`/api/courses/${course.id}`).end();
  } catch (error) {
    console.log("Error: ", error.name);
    
    if (
      error.name === "SequelizeValidationError" || 
      error.name === "SequelizeUniqueConstraintError"
    ) {
      const errors = error.errors.map((err) => err.message);
      res.status(400).json({ errors });
    } else {
      throw error;
    }
  }
}));

router.put("/courses/:id", authenticateUser, asyncHandler(async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);

    if (course) {
      if (req.currentUser.id === course.userId) {
        await course.update(req.body);
        res.status(204).json({
          message: "The Course has been updated"
        });
      } else {
        res.status(403).json({
          message: "You're not authorized to edit this Course"
        });
      }
    } else {
      res.status(404).json({
        message: "The requested Course was not found"
      });
    }
  } catch (error) {
    console.log("Error: ", error.name);

    if (
      error.name === "SequelizeValidationError" ||
      error.name === "SequelizeUniqueConstraintError"
    ) {
      const errors = error.errors.map((err) => err.message);
      res.status(400).json({ errors });
    } else {
      throw error;
    }
  }
}));

router.delete("/courses/:id", authenticateUser, asyncHandler(async (req, res) => {
  const course = await Course.findByPk(req.params.id);

  if (course) {
    if (req.currentUser.id === course.userId) {
      await course.destroy();
      res.status(204).end();
    } else {
      res.status(403).json({
        message: "You're not authorized to delete this Course"
      });
    }
  } else {
    res.status(404).json({
      message: "The requested Course was not found"
    });
  }
}));

module.exports = router;