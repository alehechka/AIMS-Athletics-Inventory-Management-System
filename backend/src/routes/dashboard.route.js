"use strict";

const express = require("express");
const { Equipment, InventorySize, Inventory, Sport, addDisplayNameToSports } = require("../models/database");
const auth = require("../middleware/auth");
const queryParams = require("../middleware/queryParams");
const Sequelize = require("sequelize");

const dashboardRouter = express.Router();

const thirtyDays = 1000 * 60 * 60 * 24 * 30;

dashboardRouter.get("/", (req, res) => {
  res.json({
    message: "dashboard"
  });
});

dashboardRouter.get(
  "/equipment",
  auth(["isAdmin", "isEmployee", "isCoach"]),
  queryParams([], []),
  async (req, res, next) => {
    try {
      let equipment = await Equipment.findAll({
        where: Sequelize.and({ organizationId: req.user.organizationId }, { count: { [Sequelize.Op.gte]: 1 } }),
        include: [
          {
            model: InventorySize,
            include: [
              {
                model: Inventory,
                include: [
                  {
                    model: Sport
                  }
                ]
              }
            ]
          }
        ]
      });

      let sportEquipment = [];
      for (let item of equipment) {
        let index = 0;
        if (
          (index = sportEquipment.findIndex((element) => element.sport.id === item.inventorySize.inventory.sportId)) >= 0
        ) {
          sportEquipment[index].quantityCheckedOut += item.count;
          sportEquipment[index].totalCheckedOut += (item.inventorySize.price * item.count);
        } else {
          sportEquipment.push({
            sport: addDisplayNameToSports(item.inventorySize.inventory.sport),
            quantityCheckedOut: item.count,
            totalCheckedOut: item.inventorySize.price * item.count
          });
        }
      }

      res.json(sportEquipment);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = dashboardRouter;
