"use strict";

const express = require("express");
const { Credential } = require("../models/database");
const auth = require("../middleware/auth");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Sequelize = require("sequelize");

const credentialRouter = express.Router();

require("mandatoryenv").load(["PRIVATE_KEY"]);
const { PRIVATE_KEY } = process.env;

const thirtyDays = 1000 * 60 * 60 * 24 * 30;

//POST /api/v#/credentials/current
//Get current user from token, use to validate JWT
credentialRouter.get("/current", auth, async (req, res, next) => {
  try {
    let credential = await Credential.findOne({
      where: {
        id: req.user.id
      },
      attributes: [
        "email",
        "username",
        "isAdmin",
        "isEmployee",
        "isAthlete",
        "isCoach"
      ]
    });
    res.json(credential);
  } catch (err) {
    //Add error handling for duplicate students and other SQL issues
    next(err);
  }
});

//POST /api/v#/credentials/signup
//Create new user
credentialRouter.post("/signup", async (req, res, next) => {
  const credential = req.body;
  try {
    let createdCred = await Credential.create({
      email: credential.email,
      username: credential.username,
      password: credential.password
    });

    const token = await jwt.sign(
      {
        id: createdCred.id,
        isAdmin: createdCred.isAdmin,
        isEmployee: createdCred.isEmployee,
        isAthlete: createdCred.isAthlete,
        isCoach: createdCred.isCoach
      },
      PRIVATE_KEY,
      { expiresIn: "30d" }
    );
    res.cookie("authorization", token, {
      expires: new Date(Date.now() + thirtyDays),
      httpOnly: false
    });
    res.json({
      email: createdCred.email,
      username: createdCred.username,
      isAdmin: createdCred.isAdmin,
      isEmployee: createdCred.isEmployee,
      isAthlete: createdCred.isAthlete,
      isCoach: createdCred.isCoach,
      token
    });
  } catch (err) {
    //Add error handling for duplicate students and other SQL issues
    next(err);
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
          username: credential.username
            ? credential.username
            : credential.email.split("@")[0]
        }
      )
    });
    if (foundCred) {
      await bcrypt.compare(
        credential.password,
        foundCred.password,
        (err, result) => {
          if (result) {
            let token = jwt.sign(
              {
                id: foundCred.id,
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
              expires: credential.remember ? new Date(Date.now() + thirtyDays) : 0,
              httpOnly: false
            });
            res.json({
              email: foundCred.email,
              username: foundCred.username,
              isAdmin: foundCred.isAdmin,
              isEmployee: foundCred.isEmployee,
              isAthlete: foundCred.isAthlete,
              isCoach: foundCred.isCoach,
              token
            });
          } else {
            res.status(401).json({ message: "Credentials not valid" });
          }
        }
      );
    } else {
      res.status(401).json({ message: "Credentials not found" });
    }
  } catch (err) {
    next(err);
  }
});

//PUT /api/v#/credentials/change_password
//Create new user
/************** DO NOT USE *****************/
/****** Passwords gets changed but you are unable to login afterwards, need to research what's happening ******/
credentialRouter.put("/change_password", auth, async (req, res, next) => {
  const credential = req.body;
  try {
    let foundCred = await Credential.findOne({
      where: {
        id: req.user.id
      }
    });
    if (foundCred) {
      await bcrypt.compare(
        credential.password,
        foundCred.password,
        async (err, result) => {
          if (result) {
            if (credential.password !== credential.newPassword) {
              foundCred.password = credential.newPassword;
              await foundCred.save();
              res.json({
                message: "Password successfully changed."
              });
            } else {
              res
                .status(401)
                .json({ message: "Password cannot match previous password." });
            }
          } else {
            res.status(401).json({ message: "Credentials not valid" });
          }
        }
      );
    } else {
      res.status(401).json({ message: "Credentials not found" });
    }
  } catch (err) {
    next(err);
  }
});

module.exports = credentialRouter;
