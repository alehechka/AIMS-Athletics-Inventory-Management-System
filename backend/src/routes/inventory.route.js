"use strict";

const express = require("express");
const Sequelize = require("sequelize");
const queryParams = require("../middleware/queryParams");
const { Inventory, InventorySize, SportSize, Sport, addDisplayNameToSports } = require("../models/database");
const auth = require("../middleware/auth");
const inventoryRouter = express.Router();

//GET /api/v#/inventory
//Get all inventory with filters
//Sending an inventory ID will retreive the full details of the single item.
inventoryRouter.get(
  "/",
  auth(["isAdmin", "isEmployee", "isCoach"]),
  queryParams([], ["page", "limit", "id", "surplus", "sportSizeId", "sports[]", "gender", "taxable", "expendable"]),
  async (req, res, next) => {
    try {
      const offset = req.query["page"] * req.query["limit"] || 0;
      const limit = req.query["limit"] || 200;
      let inventories = await Inventory.findAll({
        offset,
        limit,
        where: Sequelize.and(
          req.query.id && { id: req.query.id },
          { organizationId: req.user.organizationId },
          req.query.surplus && { surplus: req.query.surplus },
          req.query.sportSizeId && { sportSizeId: req.query.sportSizeId },
          req.query.taxable && { taxable: req.query.taxable },
          req.query.expendable && { expendable: req.query.expendable }
        ),
        attributes: {
          exclude: ["createdAt", "updatedAt", "sportSizeId", "organizationId"]
        },
        include: [
          {
            model: InventorySize,
            attributes: {
              exclude: req.query.id
                ? ["createdAt", "updatedAt", "inventoryId"]
                : ["createdAt", "updatedAt", "inventoryId", "barcode"]
            }
          },
          {
            model: Sport,
            attributes: { exclude: ["organizationId"] },
            where: Sequelize.and(
              req.query.gender && { gender: req.query.gender },
              req.query["sports[]"] && Sequelize.or({ id: req.query["sports[]"] })
            )
          },
          {
            model: SportSize,
            where: Sequelize.and(
              req.query.sportSizeId && { id: req.query.sportSizeId },
            ),
            attributes: {
              exclude: req.query.id ? [] : ["sizes"]
            },
            include: [
              {
                model: Sport,
                attributes: { exclude: ["organizationId"] }
              }
            ]
          }
        ]
      });
      for (let inventory of inventories) {
        inventory.sport = await addDisplayNameToSports(inventory.sport);
      }
      res.json(req.query.id && inventories.length ? inventories[0] : inventories);
    } catch (err) {
      next(err);
    }
  }
);

//POST /api/v#/inventory
//Create new inventory item and its sizes
inventoryRouter.post("/", auth(["isAdmin", "isEmployee"]), async (req, res, next) => {
  let postInventory = req.body;
  try {
    let inventory = await Inventory.create({
      name: postInventory.name,
      description: postInventory.description,
      surplus: postInventory.surplus,
      taxable: postInventory.taxable,
      expendable: postInventory.expendable,
      organizationId: req.user.organizationId,
      sportSizeId: postInventory.sportSizeId
    });
    for (let inventorySize of postInventory.inventorySizes) {
      await InventorySize.create({
        size: inventorySize.size,
        barcode: inventorySize.barcode,
        price: inventorySize.price,
        quantity: inventorySize.quantity,
        inventoryId: inventory.id
      });
    }
    res.status(201).json(
      await Inventory.findOne({
        where: { id: inventory.id },
        attributes: {
          exclude: ["createdAt", "updatedAt", "sportSizeId", "organizationId"]
        },
        include: [
          {
            model: InventorySize,
            attributes: { exclude: ["createdAt", "updatedAt", "inventoryId"] }
          },
          {
            model: SportSize,
            attributes: {
              exclude: ["sportId"]
            },
            include: [{ model: Sport, attributes: { exclude: ["organizationId"] } }]
          }
        ]
      })
    );
  } catch (err) {
    next(err);
  }
});

//POST /api/v#/inventory
//Updates the selected inventory item and its sizes
inventoryRouter.put("/", auth(["isAdmin", "isEmployee"]), queryParams(["id"]), async (req, res, next) => {
  let putInventory = req.body;
  try {
    let foundItem = await Inventory.findOne({
      where: {
        id: req.query.id
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "sportSizeId", "organizationId"]
      },
      include: [
        {
          model: InventorySize,
          attributes: { exclude: ["createdAt", "updatedAt", "inventoryId"] }
        },
        {
          model: SportSize,
          attributes: {
            exclude: ["sportId"]
          },
          include: [{ model: Sport, attributes: { exclude: ["organizationId"] } }]
        }
      ]
    });

    foundItem.name = putInventory.name;
    foundItem.description = putInventory.description;
    foundItem.surplus = putInventory.surplus;
    foundItem.taxable = putInventory.taxable;
    foundItem.expendable = putInventory.expendable;
    foundItem.sportSizeId = putInventory.sportSizeId;
    await foundItem.save();

    let addItems = putInventory.inventorySizes.filter((item) => !item.id);
    let deleteItems = foundItem.inventorySizes.filter((item) => {
      return putInventory.inventorySizes.filter((putItem) => putItem.id === item.id).length === 0;
    });
    let updateItems = putInventory.inventorySizes.filter((item) => item.id);

    for (let item of updateItems) {
      await InventorySize.update(
        {
          size: item.size,
          barcode: item.barcode,
          price: item.price,
          quantity: item.quantity
        },
        {
          where: {
            id: item.id
          }
        }
      );
    }

    for (let item of addItems) {
      await InventorySize.create({
        size: item.size,
        barcode: item.barcode,
        price: item.price,
        quantity: item.quantity,
        inventoryId: foundItem.id
      });
    }
    for (let item of deleteItems) {
      await InventorySize.destroy({
        where: {
          id: item.id
        }
      });
    }
    res.json(await foundItem.reload());
  } catch (err) {
    next(err);
  }
});

module.exports = inventoryRouter;
