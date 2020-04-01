"use strict";

const express = require("express");
const Sequelize = require("sequelize");
const { Equipment, InventorySize, Inventory, SportSize, Sport, User, UserSport } = require("../models/database");
const auth = require("../middleware/auth");
const queryParams = require("../middleware/queryParams");
const equipmentRouter = express.Router();

//Get /api/v#/sports
//Create new sport
equipmentRouter.get("/", auth(["isAdmin", "isEmployee", "isCoach"]), queryParams([], ["page", "limit", "userId", "sports[]", "sportSizeId", "inventoryId", "taxable", "surplus", "expendable"]), async (req, res, next) => {
  try {

    let coachSports = [];
      if (req.user.highestAccess.isCoach) {
        coachSports = await UserSport.findAll({
          where: {
            userId: req.user.id
          },
          attributes: ["sportId"]
        }).map((sport) => {
          return sport.sportId;
        });
      }

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
                    req.query["sports[]"] ? Sequelize.or({ sportId: req.query["sports[]"] }) : null,
                    req.user.highestAccess.isCoach ? Sequelize.or({ id: coachSports }) : null
                ),
                include: [
                  {
                    model: Sport,
                    where: Sequelize.and(
                      req.query["sports[]"] ? Sequelize.or({ id: req.query["sports[]"] }) : null,
                      req.user.highestAccess.isCoach ? Sequelize.or({ id: coachSports }) : null
                    ),
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

//Get /api/v#/sports
//Create new sport
equipmentRouter.get("/current", auth(), async (req, res, next) => {
  try {
    let user = await User.findOne({
      where: {
        credentialId: req.user.id
      }
    });
    let equipment = await Equipment.findAll({
      where: {
        userId: user.id
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "inventorySizeId", "organizationId"]
      },
      include: [
        {
          model: InventorySize,
          attributes: {
            exclude: ["createdAt", "updatedAt", "inventoryId"]
          },
          include: {
            model: Inventory,
            attributes: {
              exclude: ["createdAt", "updatedAt", "sportSizeId", "organizationId"]
            },
            include: [
              {
                model: SportSize,
                attributes: {
                  exclude: ["sportId"]
                },
                include: [
                  {
                    model: Sport,
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
    res.json(equipment);
  } catch (err) {
    next(err);
  }
});

module.exports = equipmentRouter;
