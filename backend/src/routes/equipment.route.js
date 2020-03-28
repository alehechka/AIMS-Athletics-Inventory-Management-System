"use strict";

const express = require("express");
const Sequelize = require("sequelize");
const { Equipment, InventorySize, Inventory, SportSize, Sport } = require("../models/database");
const auth = require("../middleware/auth");
const queryParams = require("../middleware/queryParams");
const equipmentRouter = express.Router();

//Get /api/v#/sports
//Create new sport
equipmentRouter.get("/", auth(), queryParams([], ["userId", "sports[]", "sportSizeId", "inventoryId", "taxable", "surplus", "expendable"]), async (req, res, next) => {
  try {
    let equipment = await Equipment.findAll({
      where: Sequelize.and(req.query.userId ? { userId: req.query.userId } : null),
      attributes: {
        exclude: ["createdAt", "updatedAt", "inventorySizeId", "organizationId"]
      },
      include: [
        {
          model: InventorySize,
          attributes: {
            exclude: ["createdAt", "updatedAt", "inventoryId"]
          },
          where: Sequelize.and(
              req.query.inventoryId ? { inventoryId: req.query.inventoryId } : null
          ),
          include: {
            model: Inventory,
            attributes: {
              exclude: ["createdAt", "updatedAt", "sportSizeId", "organizationId"]
            },
            where: Sequelize.and(
                req.query.inventoryId ? { id: req.query.inventoryId } : null,
                req.query.taxable ? { taxable: req.query.taxable } : null,
                req.query.surplus ? { surplus: req.query.surplus } : null,
                req.query.expendable ? { expendable: req.query.expendable } : null
            ),
            include: [
              {
                model: SportSize,
                attributes: {
                  exclude: ["sportId"]
                },
                where: Sequelize.and(
                    req.query.sportSizeId ? { id: req.query.sportSizeId } : null, 
                    req.query["sports[]"] ? Sequelize.or({ sportId: req.query["sports[]"] }) : null
                ),
                include: [
                  {
                    model: Sport,
                    where: req.query["sports[]"] ? Sequelize.or({ id: req.query["sports[]"] }) : null,
                    attributes: {
                      exclude: ["organizationId"]
                    }
                  }
                ]
              }
            ]
          }
        }
      ]
    });
    res.json(
      req.query["sports[]"] || req.query.sportSizeId
        ? equipment.filter((equip) => {
            return equip.inventorySize.inventory;
          })
        : req.query.taxable || req.query.surplus || req.query.expendable 
        ? equipment.filter((equip) => {
            return equip.inventorySize;
          })
        : equipment
    );
  } catch (err) {
    next(err);
  }
});

module.exports = equipmentRouter;
