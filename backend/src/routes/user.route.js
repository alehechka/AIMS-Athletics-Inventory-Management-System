"use strict";

const express = require("express");
const Sequelize = require("sequelize");
const auth = require("../middleware/auth");
const {
  User,
  PlayerSport,
  Sport,
  PlayerSize,
  Credential,
  SportSize
} = require("../models/database");
//const users = require('../models/database');
const userRouter = express.Router();

//POST /api/v#/users
//Allows an admin to create a new user profile with temporary login credentials
userRouter.post("/", auth(["isAdmin"]), async (req, res, next) => {
  const user = req.body;
  try {
    let createdCred = await Credential.create({
      email: user.email,
      username: user.username,
      password: user["password"] || "password123",
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
      lockerNumber: user.lockerNumber,
      lockerCode: user.lockerCode,
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
userRouter.get(
  "/",
  auth(["isAdmin", "isEmployee", "isCoach"]),
  async (req, res, next) => {
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
        where: Sequelize.and(
          { organizationId: req.user.organizationId },
          req.query.id ? { id: req.query.id } : null,
          req.query.gender ? { gender: req.query.gender } : null
        ),
        include: [
          {
            model: Sport,
            attributes: ["id", "name", "gender"],
            through: { attributes: [] },
            where: Sequelize.and(
              req.query['sports[]'] ? Sequelize.or({id: req.query['sports[]']}) : null,
              isCoach ? Sequelize.or({ id: coachSports }) : null
            )
          },
          {
            model: PlayerSize,
            attributes: ["id", "sportSizeId", "size"],
            include: [
              {
                model: SportSize,
                attributes: ["sportId", "name", "sizes"]
              }
            ]
          },
          {
            model: Credential,
            attributes: req.user.isAdmin
              ? { exclude: ["organizationId", "password"] }
              : ["email", "username"]
          }
        ]
      });
      res.json(req.query.id && allUsers.length === 1 ? allUsers[0] : allUsers);
    } catch (err) {
      next(err);
    }
  }
);

//GET /api/v#/users/current
//Retrieves the currently logged in user
userRouter.get("/current", auth(), async (req, res, next) => {
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
        { model: PlayerSize },
        {
          model: Credential,
          attributes: req.user.isAdmin
            ? { exclude: ["organizationId", "password"] }
            : ["email", "username"]
        }
      ]
    });
    res.json(user);
  } catch (err) {
    next(err);
  }
});

//PUT /api/v#/users/current
//Updates the currently logged in user
userRouter.put("/current", auth(), async (req, res, next) => {
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
userRouter.put("/", auth(["isAdmin", "isEmployee"]), async (req, res, next) => {
  if (!req.query.id) {
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
        foundUser.schoolId = putUser.schoolId;
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
