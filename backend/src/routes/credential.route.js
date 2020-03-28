"use strict";

const express = require("express");
const { Credential, Organization, User, UserSport, hashPassword } = require("../models/database");
const auth = require("../middleware/auth");
const queryParams = require("../middleware/queryParams");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Sequelize = require("sequelize");

const credentialRouter = express.Router();

require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });
const { PRIVATE_KEY } = process.env;

const thirtyDays = 1000 * 60 * 60 * 24 * 30;

//GET /api/v#/credentials/current
//Get current user from token, use to validate JWT
credentialRouter.get("/current", auth(), async (req, res, next) => {
  try {
    let credential = await Credential.findOne({
      where: {
        id: req.user.id
      },
      attributes: ["email", "username", "isAdmin", "isEmployee", "isAthlete", "isCoach"],
      include: { model: Organization }
    });
    res.json(credential);
  } catch (err) {
    //Add error handling for duplicate students and other SQL issues
    next(err);
  }
});

//POST /api/v#/credentials/signup
//Create new user with empty user profile
credentialRouter.post("/signup", async (req, res, next) => {
  const credential = req.body;
  try {
    let createdCred = await Credential.create({
      email: credential.email,
      username: credential.username,
      password: await hashPassword(credential.password),
      organizationId: 1 //This needs to be changed to be set to whichever Organization the user must be a part of
    });

    let createdUser = await User.create({
      credentialId: createdCred.id,
      organizationId: createdCred.organizationId
    });

    //This needs to be changed to be the "Admin" sport for whichever organization they are in
    await UserSport.create({
      userId: createdUser.id,
      sportId: 1
    });

    let organization = await Organization.findOne({
      where: {
        id: 1
      }
    });

    const token = await jwt.sign(
      {
        id: createdCred.id,
        organizationId: createdCred.organizationId,
        isAdmin: createdCred.isAdmin,
        isEmployee: createdCred.isEmployee,
        isAthlete: createdCred.isAthlete,
        isCoach: createdCred.isCoach
      },
      PRIVATE_KEY,
      { expiresIn: "30d" }
    );
    res
      .status(201)
      .cookie("authorization", token, {
        expires: credential.remember ? new Date(Date.now() + thirtyDays) : 0,
        httpOnly: true
      })
      .json({
        email: createdCred.email,
        username: createdCred.username,
        isAdmin: createdCred.isAdmin,
        isEmployee: createdCred.isEmployee,
        isCoach: createdCred.isCoach,
        isAthlete: createdCred.isAthlete,
        organization: organization
      });
  } catch (err) {
    res.status(401).send("Email or username already in use.")
  }
});

//POST /api/v#/credentials/login
//Create new user
credentialRouter.post("/login", async (req, res, next) => {
  const credential = req.body;
  try {
    let foundCred = await Credential.findOne({
      where: Sequelize.or(
        { email: credential.email },
        {
          username: credential.username ? credential.username : credential.email.split("@")[0]
        }
      ),
      include: { model: Organization }
    });
    if (foundCred) {
      await bcrypt.compare(credential.password, foundCred.password, (err, result) => {
        if (result) {
          let token = jwt.sign(
            {
              id: foundCred.id,
              organizationId: foundCred.organizationId,
              isAdmin: foundCred.isAdmin,
              isEmployee: foundCred.isEmployee,
              isAthlete: foundCred.isAthlete,
              isCoach: foundCred.isCoach
            },
            PRIVATE_KEY,
            {
              expiresIn: "30d"
            }
          );
          res
            .cookie("authorization", token, {
              expires: credential.remember ? new Date(Date.now() + thirtyDays) : 0,
              httpOnly: true
            })
            .json({
              email: foundCred.email,
              username: foundCred.username,
              isAdmin: foundCred.isAdmin,
              isEmployee: foundCred.isEmployee,
              isCoach: foundCred.isCoach,
              isAthlete: foundCred.isAthlete,
              organization: foundCred.organization
            });
        } else {
          res.status(401).send("Credentials not valid");
        }
      });
    } else {
      res.status(401).send("Credentials not found");
    }
  } catch (err) {
    next(err);
  }
});

//GET /api/v#/credentials/logout
//Removes authorization cookie.
credentialRouter.get("/logout", auth(), async (req, res, next) => {
  res
    .status(200)
    .clearCookie("authorization")
    .send("User has been logged out.");
});

//PUT /api/v#/credentials/current
//Updates the current user's email, username, and (roles if an admin)
//Will update authorization cookie if need be.
credentialRouter.put("/current", auth(), async (req, res, next) => {
  let putCred = req.body;
  try {
    let foundCred = await Credential.findOne({
      where: {
        id: req.user.id
      }
    });

    foundCred.email = putCred["email"] || foundCred.email;
    foundCred.username = putCred["username"] || foundCred.username;
    if (req.user.isAdmin) {
      //Cannot remove admin access from themselves
      foundCred.isEmployee =
        putCred.isEmployee === true || putCred.isEmployee === false ? putCred.isEmployee : foundCred.isEmployee;
      foundCred.isCoach = putCred.isCoach === true || putCred.isCoach === false ? putCred.isCoach : foundCred.isCoach;
      foundCred.isAthlete =
        putCred.isAthlete === true || putCred.isAthlete === false ? putCred.isAthlete : foundCred.isAthlete;

      await foundCred.save();
      let token = jwt.sign(
        {
          id: foundCred.id,
          organizationId: foundCred.organizationId,
          isAdmin: foundCred.isAdmin,
          isEmployee: foundCred.isEmployee,
          isAthlete: foundCred.isAthlete,
          isCoach: foundCred.isCoach
        },
        PRIVATE_KEY,
        {
          expiresIn: "30d"
        }
      );
      res.cookie("authorization", token, {
        expires: 0,
        httpOnly: true
      });
    }
    res.send("Credential update successful");
  } catch (err) {
    next(err);
  }
});

//PUT /api/v#/credentials
//Allows admin to update the desired user's email, username, and roles
credentialRouter.put("/", auth(["isAdmin"]), queryParams(["id"]), async (req, res, next) => {
  let putCred = req.body;
  try {
    let foundCred = await Credential.findOne({
      where: {
        id: req.query.id
      }
    });

    foundCred.email = putCred["email"] || foundCred.email;
    foundCred.username = putCred["username"] || foundCred.username;
    if (req.user.id !== foundCred.id) {
      //Cannot remove admin access from themselves
      foundCred.isAdmin = putCred.isAdmin === true || putCred.isAdmin === false ? putCred.isAdmin : foundCred.isAdmin;
    }
    foundCred.isEmployee =
      putCred.isEmployee === true || putCred.isEmployee === false ? putCred.isEmployee : foundCred.isEmployee;
    foundCred.isCoach = putCred.isCoach === true || putCred.isCoach === false ? putCred.isCoach : foundCred.isCoach;
    foundCred.isAthlete =
      putCred.isAthlete === true || putCred.isAthlete === false ? putCred.isAthlete : foundCred.isAthlete;

    await foundCred.save();

    res.send("Credential update successful");
  } catch (err) {
    next(err);
  }
});

//PUT /api/v#/credentials/changePassword
//Update current user's password.
credentialRouter.put("/changePassword", auth(), async (req, res, next) => {
  const credential = req.body;
  try {
    let foundCred = await Credential.findOne({
      where: {
        id: req.user.id
      }
    });
    if (foundCred) {
      await bcrypt.compare(credential.password, foundCred.password, async (err, result) => {
        if (result) {
          if (credential.password !== credential.newPassword) {
            (foundCred.password = await hashPassword(credential.newPassword)), await foundCred.save();
            res.send("Password successfully changed.");
          } else {
            res.status(400).send("Password cannot match previous password.");
          }
        } else {
          res.status(401).send("Credentials not valid");
        }
      });
    } else {
      res.status(401).send("Credentials not found");
    }
  } catch (err) {
    next(err);
  }
});

/*********** Create route that sends an reset password email to user.  *****************/

module.exports = credentialRouter;
