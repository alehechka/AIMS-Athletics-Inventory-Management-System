"use strict";

const express = require("express");
const Sequelize = require("sequelize");
const { Transaction, User, Equipment, InventorySize, Inventory, SportSize, addFullNameToUsers } = require("../models/database");
const auth = require("../middleware/auth");
const queryParams = require("../middleware/queryParams");
const { getCoachSports } = require("./sport.route");
const transactionRouter = express.Router();

// POST /api/v#/transactions/checkOut
// Checks out inventory to users included
transactionRouter.post("/checkOut", auth(["isAdmin", "isEmployee", "isCoach"]), async (req, res, next) => {
  let { transactions, comment } = req.body;
  let createdTransactions = [];
  try {
    let issuedBy = await User.findOne({
      where: {
        credentialId: req.user.id
      }
    });
    for (let transaction of transactions) {
      let userEquipment = await Equipment.findAll({
        where: {
          userId: transaction.issuedTo
        }
      });
      for (let item of transaction.items) {
        //Update/create equipment entries
        let equipment = userEquipment.find((equipment) => equipment.inventorySizeId === item.inventorySize);
        if (equipment) {
          equipment.count += item.amount;
          await equipment.save();
        } else {
          equipment = await Equipment.create({
            count: item.amount,
            userId: transaction.issuedTo,
            inventorySizeId: item.inventorySize,
            organizationId: req.user.organizationId
          });
          userEquipment.push(equipment);
        }
        //Update inventory size quantity
        let inventorySize = await InventorySize.findOne({
          where: {
            id: item.inventorySize
          }
        });
        inventorySize.quantity -= item.amount;
        await inventorySize.save();
        //Create transaction
        await Transaction.create({
          amount: item.amount,
          comment,
          equipmentId: equipment.id,
          issuedBy: issuedBy.id,
          issuedTo: transaction.issuedTo,
          organizationId: req.user.organizationId
        }).then((transaction) => {
          createdTransactions.push(transaction.id);
        });
      }
    }
    res.json(await getTransactions(req.user, { transactionIDs: createdTransactions }));
  } catch (err) {
    next(err);
  }
});

// POST /api/v#/transactions/checkIn
// Checks in equipment from users included
transactionRouter.post("/checkIn", auth(["isAdmin", "isEmployee", "isCoach"]), async (req, res, next) => {
  let { transactions, comment } = req.body;
  let createdTransactions = [];
  try {
    let issuedBy = await User.findOne({
      where: {
        credentialId: req.user.id
      }
    });
    for (let transaction of transactions) {
      let userEquipment = await Equipment.findAll({
        where: {
          userId: transaction.issuedTo
        }
      });
      for (let item of transaction.items) {
        //Update/create equipment entries
        let equipment = userEquipment.find((equipment) => equipment.id === item.equipment);
        if (equipment) {
          equipment.count -= item.amount;
          await equipment.save();
          //Update inventory size quantity
          let inventorySize = await InventorySize.findOne({
            where: {
              id: equipment.inventorySizeId
            }
          });
          inventorySize.quantity += item.amount;
          await inventorySize.save();
          //Create transaction
          await Transaction.create({
            amount: item.amount,
            comment,
            returned: true,
            equipmentId: equipment.id,
            issuedBy: issuedBy.id,
            issuedTo: transaction.issuedTo,
            organizationId: req.user.organizationId
          }).then((transaction) => {
            createdTransactions.push(transaction.id);
          });
        }
      }
    }
    res.json(await getTransactions(req.user, { transactionIDs: createdTransactions }));
  } catch (err) {
    next(err);
  }
});

//Get /api/v#/transactions
//Get list of transactions
transactionRouter.get(
  "/",
  auth(["isAdmin", "isEmployee", "isCoach"]),
  queryParams([], ["returned", "createdBegin", "createdEnd", "sports[]", "issuedTo", "issuedBy", "transactionIDs[]"]),
  async (req, res, next) => {
    try {
      res.json(
        await getTransactions(req.user, {
          returned: req.query.returned,
          createdBegin: req.query.createdBegin,
          createdEnd: req.query.createdEnd,
          sports: req.query["sports[]"],
          issuedTo: req.query.issuedTo,
          issuedBy: req.query.issuedBy,
          transactionIDs: req.query["transactionIDs[]"]
        })
      );
    } catch (err) {
      next(err);
    }
  }
);

//Get /api/v#/transactions
//Get current user's transactions
transactionRouter.get(
  "/current",
  auth(),
  queryParams([], ["returned", "createdBegin", "createdEnd"]),
  async (req, res, next) => {
    try {
      let user = await User.findOne({
        where: {
          credentialId: req.user.id
        }
      });
      res.json({
        issuedBy: await getTransactions(req.user, {
          issuedBy: user.id,
          returned: req.query.returned,
          createdBegin: req.query.createdBegin,
          createdEnd: req.query.createdEnd
        }),
        issuedTo: await getTransactions(req.user, {
          issuedTo: user.id,
          returned: req.query.returned,
          createdBegin: req.query.createdBegin,
          createdEnd: req.query.createdEnd
        })
      });
    } catch (err) {
      next(err);
    }
  }
);

async function getTransactions(
  user,
  { page, limit, issuedBy, issuedTo, returned, createdBegin, createdEnd = new Date(), sports, transactionIDs }
) {
  try {
    let coachSports = [];
    if (user.highestAccess.isCoach) {
      coachSports = await getCoachSports(user.id);
    }

    const offset = page * limit || 0;
    const pageLimit = limit || 200;
    let transactions = await Transaction.findAll({
      offset,
      limit: pageLimit,
      where: Sequelize.and(
        { organizationId: user.organizationId },
        issuedBy && { issuedBy },
        issuedTo && { issuedTo },
        returned && { returned },
        createdBegin && { createdAt: { [Sequelize.Op.gte]: createdBegin } },
        { createdAt: { [Sequelize.Op.lte]: createdEnd } },
        transactionIDs && Sequelize.or({ id: transactionIDs })
      ),
      attributes: {
        exclude: ["equipmentId", "issuedBy", "issuedTo", "organizationId"]
      },
      include: [
        {
          model: User,
          as: "IssuedBy",
          attributes: ["id", "firstName", "lastName", "fullName"]
        },
        {
          model: User,
          as: "IssuedTo",
          attributes: ["id", "firstName", "lastName", "fullName"]
        },
        {
          model: Equipment,
          attributes: {
            exclude: ["createdAt", "updatedAt", "userId", "inventorySizeId", "organizationId"]
          },
          include: [
            {
              model: InventorySize,
              attributes: {
                exclude: ["createdAt", "updatedAt", "inventoryId"]
              },
              include: [
                {
                  model: Inventory,
                  attributes: {
                    exclude: ["createdAt", "updatedAt", "organizationId", "sportSizeId"]
                  },
                  include: {
                    model: SportSize,
                    attributes: ["id", "sportId"],
                    where: Sequelize.and(
                      user.highestAccess.isCoach && Sequelize.or({ sportId: coachSports }),
                      sports && Sequelize.or({ sportId: sports })
                    )
                  }
                }
              ]
            }
          ]
        }
      ]
    });
    for(let tran of transactions) {
      tran.price = tran.amount * tran.equipment.inventorySize.price;
      tran.IssuedTo = addFullNameToUsers(tran.IssuedTo)
      tran.IssuedBy = addFullNameToUsers(tran.IssuedBy)
    }
    return sports || user.highestAccess.isCoach
      ? transactions.filter((transaction) => {
          return transaction.equipment.inventorySize.inventory;
        })
      : transactions;
  } catch (err) {
    throw err;
  }
}

module.exports = transactionRouter;
