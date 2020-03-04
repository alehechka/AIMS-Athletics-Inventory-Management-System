"use strict";

const express = require("express");
const auth = require("../middleware/auth");
const { User, PlayerSport, Sport, PlayerSize } = require("../models/database");
//const users = require('../models/database');
const userRouter = express.Router();

//POST /api/v#/users
//Create new user
userRouter.post("/", auth, async (req, res, next) => {
  const user = req.body;
  try {
    let createdUser = await User.create({
      schoolId: user.schoolId,
      firstName: user.firstname,
      lastName: user.lastName,
      address: user.address,
      city: user.city,
      state: user.state,
      zip: user.zip,
      phone: user.phone,
      gender: user.gender,
      height: user.height,
      weight: user.weight,
      credentialId: req.user.id
    });
    const newUser = await User.findOne({
      where: {
        id: createdUser.id
      },
      include: [
        {
          model: PlayerSport,
          attributes: ["id"],
          include: [{ model: Sport, attributes: ["name"] }]
        }
      ]
    });
    res.json(newUser);
  } catch (err) {
    next(err);
  }
});

//GET /api/v#/users
//Retrieve all users
userRouter.get("/", async (req, res) => {
  if (!req.user.isAdmin && !req.user.isEmployee && !req.user.isCoach) {
    res.status(401).json("Unauthorized to perform this action.");
  }
  try {
    if(req.user.isCoach && !req.user.isAdmin && !req.user.isAdmin) {
        let coachSports = await PlayerSport.findAll({
            where: {
                userId: req.user.id
            },
            attributes: ["sportId"]
        })
    }
    let allUsers = await User.findAll({
      include: [
        {
          model: PlayerSport,
          attributes: ["id"],
          include: [{ model: Sport, attributes: ["name", "gender"] }]
        }
      ]
    });
    res.json(allUsers);
  } catch (err) {
    next(err);
  }
});

//GET /api/v#/users/:id
//Retrieves single user
userRouter.get("/byUserId/:id", async (req, res) => {
  if (!req.user.isAdmin && !req.user.isEmployee && !req.user.isCoach) {
    res.status(401).json("Unauthorized to perform this action.");
  }
  try {
    let user = await User.findOne({
      where: {
        id: req.params.id
      },
      include: [
        { model: PlayerSport, attributes: ["id"], include: [Sport] },
        { model: PlayerSize }
      ]
    });
    res.json(user);
  } catch (err) {
    next(err);
  }
});

//GET /api/v#/users/current
//Retrieves the currently logged in user
userRouter.get("/current", auth, async (req, res, next) => {
  try {
    let user = await User.findOne({
      where: {
        credentialId: req.user.id
      },
      include: [
        { model: PlayerSport, attributes: ["id"], include: [Sport] },
        { model: PlayerSize }
      ]
    });
    res.json(user);
  } catch (err) {
    next(err);
  }
});

//PUT /api/v#/users/current
//Updates the currently logged in user
userRouter.put("/current", auth, async (req, res, next) => {
  let putUser = req.body;
  try {
    let user = await User.findOne({
      where: {
        credentialId: req.user.id
      }
    });
    if (req.user.isAdmin) {
      user.schoolId = putUser.schoolId;
    }
    if (req.user.isAdmin || req.user.isEmployee) {
      user.lockerNumber = putUser.lockerNumber;
      user.lockerCode = putUser.lockerCode;
    }
    user.firstName = putUser.firstname;
    user.lastName = putUser.lastName;
    user.address = putUser.address;
    user.city = putUser.city;
    user.state = putUser.state;
    user.zip = putUser.zip;
    user.phone = putUser.phone;

    user.gender = putUser.gender;
    user.height = putUser.height;
    user.weight = putUser.weight;
    await user.save();
    res.json(user);
  } catch (err) {
    next(err);
  }
});

//PUT /api/v#/users/byScholId/:id
//Updates the selected user (only by admin or employee)
userRouter.put("/byUserId/:id", auth, async (req, res, next) => {
  if (!req.user.isAdmin && !req.user.isEmployee) {
    res.status(401).json("Unauthorized to perform this action.");
  }
  let putUser = req.body;
  try {
    let user = await User.findOne({
      where: {
        id: req.params.id
      }
    });
    if (req.user.isAdmin) {
      user.schoolId = putUser.schoolId;
    }
    user.lockerNumber = putUser.lockerNumber;
    user.lockerCode = putUser.lockerCode;
    user.firstName = putUser.firstname;
    user.lastName = putUser.lastName;
    user.address = putUser.address;
    user.city = putUser.city;
    user.state = putUser.state;
    user.zip = putUser.zip;
    user.phone = putUser.phone;
    user.gender = putUser.gender;
    user.height = putUser.height;
    user.weight = putUser.weight;
    await user.save();
    res.json(user);
  } catch (err) {
    next(err);
  }
});

module.exports = userRouter;
