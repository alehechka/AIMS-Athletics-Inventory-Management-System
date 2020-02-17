"use strict";

const express = require("express");
const { User, PlayerSport, Sport } = require('../models/database');
//const users = require('../models/database');
const userRouter = express.Router();

//POST /api/v#/users
//Create new user
userRouter.post("/", async (req, res, next) => {
    const user = req.body;
    try {
        let createdUser = await User.create({
            ...user
        })
        for(let sport of user.sports) {
            await PlayerSport.create({
                sportId: sport, 
                userId: createdUser.id
            })
        }
        const newUser = await User.findOne({
            where: {
                id: createdUser.id
            },
            include: [{model: PlayerSport, attributes: ['id'], include: [Sport]}]
        });
        res.json(newUser);
    } catch (err) {
        //Add error handling for duplicate students and other SQL issues
        console.error(err);
        return next(err.message);
    }
});

//GET /api/v#/users
//Retrieve all users
userRouter.get("/", async (req, res) => {
    try {
        let allUsers = await User.findAll({include: [{model: PlayerSport, attributes: ['id'], include: [Sport]}]});
        res.json(allUsers)
    } catch (err) {
        //Add error handling for duplicate students and other SQL issues
        console.log(err);
    }
});

//GET /api/v#/users/:id
//Retrieves single user
userRouter.get("/:id", async (req, res) => {
    try {
        let user = await User.findOne({
            where: {
                schoolId: req.params.id
            },
            include: [{model: PlayerSport, attributes: ['id'], include: [Sport]}]
        });
        res.json(user)
    } catch (err) {
        //Add error handling for duplicate students and other SQL issues
        console.log(err);
    }

});

module.exports = userRouter;