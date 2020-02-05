"use strict";

const express = require("express");
const { users, roles, inventory, equipment, transactions, player_sizes, player_sports, sports, status } = require('../models/database');
//const users = require('../models/database');
const userRouter = express.Router();

//POST /api/v#/users
//Create new user
userRouter.post("/", async (req, res, next) => {
    const user = req.body;
    try {
        let createdUser = await users.create({
            ...user
        })
        //Async makes it so adding the sports happens after res.json() returns, must fix this.
        if (user.sports) {
            createdUser.sports = [];
            await user.sports.forEach(async sport => {
                let createdSport = await player_sports.create({
                    sportId: sport, 
                    userId: createdUser.id
                })
                await createdUser.sports.push(
                    createdSport
                );
            })
            console.log('Sports:', createdUser.sports);
            res.json(createdUser);
        } else {
            res.json(createdUser);
        }
        //createdUser.sports = await player_sports.findAll({where: {userId: createdUser.id}});
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