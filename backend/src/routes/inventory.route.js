"use strict";

const express = require("express");
const { Inventory } = require("../models/database");
const auth = require("../middleware/auth");
const inventoryRouter = express.Router();

//GET /api/v#/inventory
//Get all inventory
inventoryRouter.get("/", auth(["isAdmin", "isEmployee", "isCoach"]), async (req, res, next) => {
    try {
      let inventories = await Inventory.findAll({
        where: {
          organizationId: req.user.organizationId
        },
        attributes: {
          exclude: ["organizationId"]
        }
      });
      res.json(inventories);
    } catch (err) {
      next(err);
    }
  });

module.exports = inventoryRouter;