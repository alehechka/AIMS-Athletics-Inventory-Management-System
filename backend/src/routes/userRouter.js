"use strict";

const express = require("express");
const users = require('../models/database');

const userRouter = express.Router();

//POST /api/v#/users
//Create new user
userRouter.post("/", async (req, res) => {
    const user = req.body;
    try {
        let createdUser = await users.create({
            ...user
        })
        res.json(createdUser)
    } catch (err) {
        //Add error handling for duplicate students and other SQL issues
        console.log(err);
    }
});

//GET /api/v#/users
//Retrieve all users
userRouter.get("/", async (req, res) => {
    try {
        let allUsers = await users.findAll();
        res.json(allUsers)
    } catch (err) {
        //Add error handling for duplicate students and other SQL issues
        console.log(err);
    }
});

//GET /api/v#/users/:id
//Retrieves single user
userRouter.get("/:id", async (req, res, next) => {
    try {
        let user = await users.findAll({
            where: {
                school_id: req.params.id
            }
        });
        res.json(user)
    } catch (err) {
        //Add error handling for duplicate students and other SQL issues
        console.log(err);
    }

});

module.exports = userRouter;