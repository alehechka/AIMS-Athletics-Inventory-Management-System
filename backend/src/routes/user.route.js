"use strict";

const express = require("express");
const auth = require("../middleware/auth");
const { User, PlayerSport, Sport } = require('../models/database');
//const users = require('../models/database');
const userRouter = express.Router();

//POST /api/v#/users
//Create new user
userRouter.post("/", auth, async (req, res, next) => {
    const user = req.body;
    try {
        let createdUser = await User.create({
            ...user,
            credentialId: req.user.id
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
            include: [{model: PlayerSport, attributes: ['id'], include: [{model: Sport, attributes: ['name']}]}]
        });
        res.json(newUser);
    } catch (err) {
        next(err);
    }
});

//GET /api/v#/users
//Retrieve all users
userRouter.get("/", async (req, res) => {
    try {
        let allUsers = await User.findAll({include: [{model: PlayerSport, attributes: ['id'], include: [{model: Sport, attributes: ['name', 'gender']}]}]});
        res.json(allUsers)
    } catch (err) {
        next(err);
    }
});

//GET /api/v#/users/:id
//Retrieves single user
userRouter.get("/bySchoolId/:id", async (req, res) => {
    try {
        let user = await User.findOne({
            where: {
                schoolId: req.params.id
            },
            include: [{model: PlayerSport, attributes: ['id'], include: [Sport]}]
        });
        res.json(user)
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
            include: [{model: PlayerSport, attributes: ['id'], include: [Sport]}]
        });
        res.json(user)
    } catch (err) {
        next(err);
    }

});

module.exports = userRouter;