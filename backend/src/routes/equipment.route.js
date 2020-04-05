"use strict";

const express = require("express");
const Sequelize = require("sequelize");
const { Equipment, InventorySize, Inventory, SportSize, Sport, User, UserSport } = require("../models/database");
const auth = require("../middleware/auth");
const queryParams = require("../middleware/queryParams");
const equipmentRouter = express.Router();

//Get /api/v#/sports
//Create new sport
equipmentRouter.get(
  "/",
  auth(["isAdmin", "isEmployee", "isCoach"]),
  queryParams(
    [],
    ["page", "limit", "userId", "sports[]", "sportSizeId", "inventoryId", "taxable", "surplus", "expendable", "count"]
  ),
  async (req, res, next) => {
    try {
      res.json(
        await getEquipment(req.user, {
          page: req.query.page,
          limit: req.query.limit,
          userId: req.query.userId,
          sports: req.query["sports[]"],
          sportSizeId: req.query.sportSizeId,
          inventoryId: req.query.inventoryId,
          taxable: req.query.taxable,
          surplus: req.query.surplus,
          expendable: req.query.expendable,
          count: req.query.count
        })
      );
    } catch (err) {
      next(err);
    }
  }
);

//Get /api/v#/sports
//Create new sport
equipmentRouter.get("/current", auth(), queryParams([],["count"]), async (req, res, next) => {
  try {
    let user = await User.findOne({
      where: {
        credentialId: req.user.id
      }
    });
    res.json(await getEquipment(req.user, { userId: user.id, count: req.query.count }));
  } catch (err) {
    next(err);
  }
});

async function getEquipment(
  user,
  { page, limit, userId, sports, sportSizeId, inventoryId, taxable, surplus, expendable, count=1 }
) {
  try {
    let coachSports = [];
    if (user.highestAccess.isCoach) {
      coachSports = await Sport.findAll({
        where: {
          default: false
        },
        attributes: ["id"],
        include: [
          {
            model: User,
            where: {
              credentialId: user.id
            }
          }
        ]
      }).map((sport) => {
        return sport.id;
      });
    }

    const offset = page * limit || 0;
    const pageLimit = limit || 200;
    let equipment = await Equipment.findAll({
      offset,
      limit: pageLimit,
      where: Sequelize.and(
        userId ? { userId } : null,
        { count: { [Sequelize.Op.gte]: count } }
      ),
      attributes: {
        exclude: ["createdAt", "updatedAt", "inventorySizeId", "organizationId"]
      },
      include: [
        {
          model: InventorySize,
          attributes: {
            exclude: ["createdAt", "updatedAt", "inventoryId"]
          },
          where: Sequelize.and(inventoryId ? { inventoryId } : null),
          include: {
            model: Inventory,
            attributes: {
              exclude: ["createdAt", "updatedAt", "sportSizeId", "organizationId"]
            },
            where: Sequelize.and(
              inventoryId ? { id: inventoryId } : null,
              taxable ? { taxable } : null,
              surplus ? { surplus } : null,
              expendable ? { expendable } : null
            ),
            include: [
              {
                model: SportSize,
                attributes: {
                  exclude: ["sportId", "sizes"]
                },
                where: Sequelize.and(
                  sportSizeId ? { id: sportSizeId } : null,
                  sports ? Sequelize.or({ sportId: sports }) : null,
                  user.highestAccess.isCoach ? Sequelize.or({ sportId: coachSports }) : null
                ),
                include: [
                  {
                    model: Sport,
                    where: Sequelize.and(
                      sports ? Sequelize.or({ id: sports }) : null,
                      user.highestAccess.isCoach ? Sequelize.or({ id: coachSports }) : null
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
    return sports || sportSizeId
      ? equipment.filter((equip) => {
          return equip.inventorySize.inventory;
        })
      : taxable || surplus || expendable
      ? equipment.filter((equip) => {
          return equip.inventorySize;
        })
      : equipment;
  } catch (err) {
    throw err;
  }
}

module.exports = equipmentRouter;
