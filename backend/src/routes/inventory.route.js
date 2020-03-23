"use strict";

const express = require("express");
const Sequelize = require("sequelize");
const queryParams = require("../middleware/queryParams");
const { Inventory, InventorySize, SportSize, Sport } = require("../models/database");
const auth = require("../middleware/auth");
const inventoryRouter = express.Router();

//GET /api/v#/inventory
//Get all inventory with filters
//Sending an inventory ID will retreive the full details of the single item.
inventoryRouter.get("/", auth(["isAdmin", "isEmployee", "isCoach"]), queryParams([], ['id', 'surplus', 'sportSizeId', 'sportId', 'gender']), async (req, res, next) => {
  try {
    let inventories = await Inventory.findAll({
      where: Sequelize.and(
        req.query.id ? { id: req.query.id } : null,
        { organizationId: req.user.organizationId },
        req.query.surplus ? { surplus: req.query.surplus } : null,
        req.query.sportSizeId ? { sportSizeId: req.query.sportSizeId } : null
      ),
      attributes: {
        exclude: ["createdAt", "updatedAt", "sportSizeId", "organizationId"],
      },
      include: [
        {
          model: SportSize,
          where: Sequelize.and(
            req.query.sportSizeId ? { id: req.query.sportSizeId } : null,
            req.query.sportId ? { sportId: req.query.sportId } : null
          ),
          attributes: {
            exclude: req.query.id ? ["sportId"] : ["sportId", "sizes"]
          },
          include: [
            {
              model: Sport,
              where: Sequelize.and(
                req.query.sportId ? { id: req.query.sportId } : null,
                req.query.gender ? { gender: req.query.gender } : null
              ),
              attributes: { exclude: ["organizationId"] }
            }
          ]
        },
        {
          model: InventorySize,
          attributes: req.query.id ? ["id", "size", "barcode", "price", "quantity"] : []   
        }
      ]
    });
    res.json(req.query.id && inventories.length ? inventories[0] : inventories);
  } catch (err) {
    next(err);
  }
});

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
    for(let inventorySize of postInventory.inventorySizes) {
      await InventorySize.create({
        size: inventorySize.size,
        barcode: inventorySize.barcode,
        price: inventorySize.price,
        quantity: inventorySize.quantity,
        inventoryId: inventory.id
      });
    }
    res.status(201).json(await Inventory.findOne({
      where: { id: inventory.id },
      attributes: {
        exclude: ["createdAt", "updatedAt", "sportSizeId"]
      },
      include: [
        {
          model: InventorySize,
          attributes: { exclude: ["createdAt", "updatedAt"] }
        },
        {
          model: SportSize,
          attributes: {
            exclude: ["sportId"]
          },
          include: [{ model: Sport, attributes: { exclude: ["organizationId"] } }]
        }
      ]
    }));
  } catch (err) {
    next(err);
  }
});

//POST /api/v#/inventory
//Updates the selected inventory item and its sizes
inventoryRouter.put("/", auth(["isAdmin", "isEmployee"]), queryParams(['id']), async (req, res, next) => {
  let putInventory = req.body;
  try {
    let foundItem = await Inventory.findOne({
      where: {
        id: req.query.id
      },
      include: [{
        model: InventorySize
      }]
    });
    foundItem.name = putInventory.name;
    foundItem.description = putInventory.description;
    foundItem.surplus = putInventory.surplus;
    foundItem.taxable = putInventory.taxable;
    foundItem.expendable = putInventory.expendable;
    foundItem.sportSizeId = putInventory.sportSizeId;
    await foundItem.save();
    res.json(foundItem)
  } catch (err) {
    next(err);
  }
});

module.exports = inventoryRouter;
