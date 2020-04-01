"use strict";

const express = require("express");
const Sequelize = require("sequelize");
const auth = require("../middleware/auth");
const queryParams = require("../middleware/queryParams");
const { User, UserSport, Sport, UserSize, Credential, SportSize, Status, hashPassword } = require("../models/database");
const userRouter = express.Router();

//POST /api/v#/users
//Allows an admin to create a new user profile with temporary login credentials
userRouter.post("/", auth(["isAdmin"]), async (req, res, next) => {
  const user = req.body;
  try {
    let createdCred = await Credential.create({
      email: user.email,
      username: user.username,
      password: await hashPassword(user["password"] || "password123"),
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
    //This needs to be changed to be the "Admin" for whichever organization they are in
    await UserSport.create({
      userId: createdUser.id,
      sportId: 1
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
  queryParams([], ["page", "limit", "id", "gender", "sports[]", "isAdmin", "isEmployee", "isCoach", "isAthlete"]),
  async (req, res, next) => {
    try {
      let coachSports = [];
      if (req.user.highestAccess.isCoach) {
        coachSports = await UserSport.findAll({
          where: {
            userId: req.user.id
          },
          attributes: ["sportId"]
        }).map((sport) => {
          return sport.sportId;
        });
      }

      const offset = req.query["page"] * req.query["limit"] || 0;
      const limit = req.query["limit"] || 200;
      let allUsers = await User.findAll({
        offset,
        //limit, //limit gets placed in the wrong location in the SQL query and caused nothing to return
        where: Sequelize.and(
          { organizationId: req.user.organizationId },
          req.query.id ? { id: req.query.id } : null,
          req.query.gender ? { gender: req.query.gender } : null
        ),
        attributes: {
          exclude: ["createdAt", "updatedAt", "credentialId", "organizationId", "statusId"]
        },
        include: [
          {
            model: Sport,
            attributes: ["id", "name", "gender"],
            through: { attributes: [] },
            where: Sequelize.and(
              req.query["sports[]"] ? Sequelize.or({ id: req.query["sports[]"] }) : null,
              req.user.highestAccess.isCoach ? Sequelize.or({ id: coachSports }) : null
            ),
            include: [
              {
                model: SportSize,
                attributes: req.query.id ? ["sportId", "name", "sizes"] : []
              }
            ]
          },
          {
            model: UserSize,
            attributes: req.query.id ? ["id", "sportSizeId", "size"] : []
          },
          {
            model: Credential,
            attributes: req.user.isAdmin ? { exclude: ["organizationId", "password"] } : ["email", "username"],
            where: req.query.isAdmin || req.query.isEmployee || req.query.isCoach || req.query.isAthlete
            ? Sequelize.or(
              req.query.isAdmin ? { isAdmin: req.query.isAdmin } : null,
              req.query.isEmployee ? { isEmployee: req.query.isEmployee } : null,
              req.query.isCoach ? { isCoach: req.query.isCoach } : null,
              req.query.isAthlete ? { isAthlete: req.query.isAthlete } : null,
            ) : null
          },
          {
            model: Status
          }
        ]
      });
      res.json(req.query.id && allUsers.length ? allUsers[0] : allUsers);
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
      attributes: {
        exclude: ["createdAt", "updatedAt", "credentialId", "organizationId", "statusId"]
      },
      include: [
        {
          model: Sport,
          attributes: ["id", "name", "gender"],
          through: { attributes: [] },
          include: [
            {
              model: SportSize,
              attributes: ["sportId", "name", "sizes"]
            }
          ]
        },
        { model: UserSize, attributes: ["id", "sportSizeId", "size"] },
        {
          model: Credential,
          attributes: req.user.isAdmin ? { exclude: ["organizationId", "password"] } : ["email", "username"]
        },
        {
          model: Status
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
userRouter.put("/", auth(["isAdmin", "isEmployee"]), queryParams(["id"]), async (req, res, next) => {
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
});

module.exports = userRouter;
