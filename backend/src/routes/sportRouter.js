"use strict";

const express = require("express");
const { users, roles, inventory, equipment, transactions, player_sizes, player_sports, sports, status } = require('../models/database');

const sportRouter = express.Router();

//POST /api/v#/sports
//Create new user
sportRouter.post("/", async (req, res) => {
    const sport = req.body;
    try {
        let createdSport = await sports.create({
            ...sport
        })
        res.json(createdSport)
    } catch (err) {
        //Add error handling for duplicate students and other SQL issues
        console.log(err);
    }
});

module.exports = sportRouter;