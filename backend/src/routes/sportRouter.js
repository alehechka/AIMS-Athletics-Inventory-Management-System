"use strict";

const express = require("express");
const { Sport } = require('../models/database');

const sportRouter = express.Router();

//POST /api/v#/sports
//Create new user
sportRouter.post("/", async (req, res) => {
    const sport = req.body;
    try {
        let createdSport = await Sport.create({
            ...sport
        })
        res.json(createdSport)
    } catch (err) {
        //Add error handling for duplicate students and other SQL issues
        console.log(err);
    }
});

//GET /api/v#/sports
//Get all sports
sportRouter.get("/", async (req, res) => {
    try {
        let sports = await Sport.findAll();
        res.json(sports)
    } catch (err) {
        //Add error handling for duplicate students and other SQL issues
        console.log(err);
    }
});

//GET /api/v#/sports/:id
//Get one sport by id
sportRouter.get("/:id", async (req, res) => {
    try {
        let sport = await Sport.findOne({
            where: {
                id: req.params.id
            }
        });
        res.json(sport)
    } catch (err) {
        //Add error handling for duplicate students and other SQL issues
        console.log(err);
    }
});

//PUT /api/v#/sports/:id
//Update one sport by id
sportRouter.put("/:id", async (req, res) => {
    const reqSport = req.body;
    try {
        if(await Sport.update({
            name: reqSport.name,
            gender: reqSport.gender,
            sizes: reqSport.sizes
        }, {
            where: {
                id: req.params.id
            }
        })) {
            let sport = await Sport.findOne({
                where: {
                    id: req.params.id
                }
            });
            res.json(sport)
        }
    } catch (err) {
        //Add error handling for duplicate students and other SQL issues
        console.log(err);
    }
});

//GET /api/v#/sports/:id
//Get one sport by id
sportRouter.delete("/:id", async (req, res) => {
    try {
        await Sport.destroy({
            where: {
                id: req.params.id
            }
        });
        res.json({success: true})
    } catch (err) {
        //Add error handling for duplicate students and other SQL issues
        console.log(err);
    }
});

module.exports = sportRouter;