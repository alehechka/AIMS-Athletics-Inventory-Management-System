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

function addDays(date, days) {
  const copy = new Date(Number(date));
  copy.setDate(date.getDate() + days);
  return copy;
}

//POST /api/v#/credentials/current
//Get current user from token, use to validate JWT
credentialRouter.get("/current", auth, async (req, res, next) => {
  try {
    let credential = await Credential.findOne({
      where: {
        id: req.user.id
      },
      attributes: ["email", "username", "isAdmin", "isEmployee", "isAthlete", "isCoach"],
    });
    res.json(credential);
  } catch (err) {
    //Add error handling for duplicate students and other SQL issues
    next(err);
  }
});

//POST /api/v#/credentials
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
    ); //get the private key from the config file -> environment variable
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

//POST /api/v#/credentials
//Create new user
credentialRouter.post("/login", async (req, res, next) => {
  const credential = req.body;
  try {
    let foundCred = await Credential.findOne({
      where: Sequelize.or(
        { email: credential.email },
        { username: credential.email.split("@")[0] }
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
            res.set({
              "Set-Cookie":
                "x-access-token=" +
                token +
                "; Expires=" +
                addDays(new Date(), 30) +
                "; Domain=localhost"
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
            next(new Error("Credentials not valid"));
          }
        }
      );
    } else {
      next(new Error("Credentials not valid"));
    }
  } catch (err) {
    next(err);
  }
});

module.exports = credentialRouter;
