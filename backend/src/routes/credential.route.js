"use strict";

const express = require("express");
const { Credential } = require('../models/database');
const auth = require("../middleware/auth");
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const Sequelize = require("sequelize");

const credentialRouter = express.Router();

//POST /api/v#/credentials/current
//Get current user from token
credentialRouter.get("/current", auth, async (req, res, next) => {
    try {
        let credential = await Credential.findOne({
            where: {
                id: req.user.id
            }, attributes: ['email', 'username']
        });
        res.json(credential)
    } catch (err) {
        //Add error handling for duplicate students and other SQL issues
        next(err);
    }
});

//POST /api/v#/credentials
//Create new user
credentialRouter.post("/", async (req, res, next) => {
    const credential = req.body;
    try {
        let createdCred = new Credential({
            ...credential
        })
        await createdCred.save();

        const token = await jwt.sign({ id: createdCred.id }, "myprivatekey"); //get the private key from the config file -> environment variable
        res.header('x-auth-token', token);
        res.json({ email: createdCred.email, username: createdCred.username })
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
        })
        if (foundCred) {
            await bcrypt.compare(credential.password, foundCred.password, (err, result) => {
                if(result) {
                    const token = jwt.sign({ id: foundCred.id }, "myprivatekey", { expiresIn: '24h' }); //get the private key from the config file -> environment variable
                    res.json({ email: foundCred.email, username: foundCred.username, token })
                } else {
                    next(new Error("Credentials not valid"));
                }
            })
        } else {
            next(new Error("Credentials not valid"));
        }
    } catch (err) {
        next(err);
    }
});

module.exports = credentialRouter;