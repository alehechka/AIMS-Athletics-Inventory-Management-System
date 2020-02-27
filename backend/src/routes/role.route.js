"use strict";

const express = require("express");
const { Credential, Role } = require('../models/database');
const auth = require("../middleware/auth");

const roleRouter = express.Router();

//POST /api/v#/roles
//Create new role
roleRouter.post("/", auth, async (req, res, next) => {
    const role = req.body;
    try {
        let createdRole = await Role.create({
            name: role.name,
            description: role.description,
            checkIn: role.checkIn,
            checkOut: role.checkOut
        })
        res.json(createdRole)
    } catch (err) {
        next(err);
    }
});

//PUT /api/v#/roles/add
//Add role to credential
roleRouter.put("/add", auth, async (req, res, next) => {
    const role = req.body;
    try {
        let credential = await Credential.findOne({
            where: {
                id: req.user.id
            }
        });
        credential.roleId = role.id;
        await credential.save();
        res.json(credential)
    } catch (err) {
        next(err);
    }
});

module.exports = roleRouter;