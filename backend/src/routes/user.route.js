"use strict";

const express = require("express");
const Sequelize = require("sequelize");
const {
  User,
  PlayerSport,
  Sport,
  PlayerSize,
  Credential
} = require("../models/database");
//const users = require('../models/database');
const userRouter = express.Router();

//POST /api/v#/users
//Allows an admin to create a new user profile with temporary login credentials
userRouter.post("/", async (req, res, next) => {
  if (!req.user.isAdmin) {
    res.status(401).json("Unauthorized to perform this action.");
  }
  const user = req.body;
  try {
    let createdCred = await Credential.create({
      email: user.email,
      username: user.username,
      password: user.password ? user.password : "password123",
      organizationId: req.user.organizationId
    });
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
      credentialId: createdCred.id,
      organizationId: req.user.organizationId
    });
    res.json(createdUser);
  } catch (err) {
    next(err);
  }
});

//GET /api/v#/users
//Retrieve all users
//URL Query Params: page, limit, id
userRouter.get("/", async (req, res, next) => {
  if (!(req.user.isAdmin || req.user.isEmployee || req.user.isCoach)) {
    res.status(401).send("Unauthorized to perform this action.");
  } else {
    try {
      let coachSports = [];
      const offset = req.query["page"] * req.query["limit"] || 0;
      const limit = req.query["limit"] || 200;
      let isCoach =
        req.user.isCoach && !req.user.isAdmin && !req.user.isEmployee;
      if (isCoach) {
        coachSports = await PlayerSport.findAll({
          offset,
          limit,
          where: {
            userId: req.user.id
          },
          attributes: ["sportId"]
        }).map(sport => {
          return sport.sportId;
        });
      }

      let allUsers = await User.findAll({
        where: req.query.id ? { id: req.query.id } : null,
        include: [
          {
            model: Sport,
            attributes: ["id", "name", "gender"],
            through: { attributes: [] },
            where: isCoach ? Sequelize.or({ id: coachSports }) : null
          },
          {
            model: PlayerSize,
            attributes: ["id", "name", "size"]
          }
        ]
      });
      res.json(req.query.id ? allUsers[0] : allUsers);
    } catch (err) {
      next(err);
    }
  }
});

//GET /api/v#/users/current
//Retrieves the currently logged in user
userRouter.get("/current", async (req, res, next) => {
  try {
    let user = await User.findOne({
      where: {
        credentialId: req.user.id
      },
      include: [
        {
          model: Sport,
          attributes: ["id", "name", "gender"],
          through: { attributes: [] }
        },
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
userRouter.put("/current", async (req, res, next) => {
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

//PUT /api/v#/users
//Updates the selected user (only by admin or employee)
//Required URL Query Param: userId
userRouter.put("/", async (req, res, next) => {
  if (!(req.user.isAdmin || req.user.isEmployee)) {
    res.status(401).send("Unauthorized to perform this action.");
  } else if (!req.query.id) {
    res.status(400).send("No user ID provided.");
  } else {
    let putUser = req.body;
    try {
      let foundUser = await User.findOne({
        where: {
          id: req.query.id
        }
      });
      if (req.user.isAdmin) {
        user.schoolId = putUser.schoolId;
      }
      foundUser.lockerNumber = putUser.lockerNumber;
      foundUser.lockerCode = putUser.lockerCode;
      foundUser.firstName = putUser.firstname;
      foundUser.lastName = putUser.lastName;
      foundUser.address = putUser.address;
      foundUser.city = putUser.city;
      foundUser.state = putUser.state;
      foundUser.zip = putUser.zip;
      foundUser.phone = putUser.phone;
      foundUser.gender = putUser.gender;
      foundUser.height = putUser.height;
      foundUser.weight = putUser.weight;
      await foundUser.save();
      res.json(foundUser);
    } catch (err) {
      next(err);
    }
  }
});

module.exports = userRouter;
