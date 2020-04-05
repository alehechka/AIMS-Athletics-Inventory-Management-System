"use strict";

const express = require("express");
const Sequelize = require("sequelize");
const { Organization } = require("../models/database");
const auth = require("../middleware/auth");
const queryParams = require("../middleware/queryParams");
const organizationRouter = express.Router();

//GET /api/v#/organizations
//Get all organizations
organizationRouter.get("/", queryParams([], ["id"]), async (req, res, next) => {
    try {
      let organizations = await Organization.findAll({
        where: Sequelize.and(
            req.query.id && {id: req.query.id}
        )
      });
      res.json(req.query.id && organizations.length ? organizations[0] : organizations);
    } catch (err) {
      next(err);
    }
  });

  module.exports = { organizationRouter };