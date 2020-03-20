"use strict";

const express = require("express");
const Sequelize = require("sequelize");
const { Inventory } = require("../models/database");
const auth = require("../middleware/auth");
const inventoryRouter = express.Router();

//GET /api/v#/inventory
//Get all inventory
inventoryRouter.get("/", auth(["isAdmin", "isEmployee", "isCoach"]), async (req, res, next) => {
  try {
    let inventories = await Inventory.findAll({
      where: Sequelize.and(
        { organizationId: req.user.organizationId },
        req.query.id ? { id: req.query.id } : null,
        req.query.surplus ? { surplus: req.query.surplus } : null
      )
    });
    res.json(inventories);
  } catch (err) {
    next(err);
  }
});

module.exports = inventoryRouter;
