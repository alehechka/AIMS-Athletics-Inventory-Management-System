"use strict";

const express = require("express");
const { Credential, Role } = require('../models/database');
const auth = require("../middleware/auth");
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const Sequelize = require("sequelize");

const credentialRouter = express.Router();

require('mandatoryenv').load([
    'PRIVATE_KEY'
]);
const { PRIVATE_KEY } = process.env;

function addDays(date, days) {
    const copy = new Date(Number(date))
    copy.setDate(date.getDate() + days)
    return copy
  }

//POST /api/v#/credentials/current
//Get current user from token, use to validate JWT
credentialRouter.get("/current", auth, async (req, res, next) => {
    try {
        let credential = await Credential.findOne({
            where: {
                id: req.user.id
            }, attributes: ['email', 'username'],
            include: [{ model: Role, attributes: { exclude: ['createdAt', 'updatedAt'] } }]
        });
        res.json(credential)
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
        let createdCred = new Credential({
            email: credential.email,
            username: credential.username,
            password: credential.password
        })
        await createdCred.save();

        const token = await jwt.sign({ id: createdCred.id }, PRIVATE_KEY, { expiresIn: '30d' }); //get the private key from the config file -> environment variable
        res.json({ email: createdCred.email, username: createdCred.username, token })
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
            ),
            include: [{ model: Role }]
        })
        if (foundCred) {
            await bcrypt.compare(credential.password, foundCred.password, (err, result) => {
                if (result) {
                    let token = jwt.sign({ id: foundCred.id }, PRIVATE_KEY, { expiresIn: '30d' });
                    res.set({ 'Set-Cookie': 'x-access-token=' + token + '; Expires=' + addDays(new Date(), 30)}); 
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