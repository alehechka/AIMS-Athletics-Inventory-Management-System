"use strict";

const express = require("express");
const { Sport, PlayerSport, User } = require("../models/database");
const auth = require("../middleware/auth");
const sportRouter = express.Router();

//POST /api/v#/sports
//Create new sport
sportRouter.post("/", auth(["isAdmin"]), async (req, res, next) => {
  const sport = req.body;
  try {
    let createdSport = await Sport.create({
      ...sport,
      organizationId: req.user.organizationId
    });
    res.json(createdSport);
  } catch (err) {
    next(err);
  }
});

//GET /api/v#/sports
//Get all sports
sportRouter.get("/", auth(), async (req, res, next) => {
  try {
    let sports = await Sport.findAll({
      where: {
        organizationId: req.user.organizationId
      },
      attributes: {
        exclude: ["organizationId"]
      }
    });
    res.json(sports);
  } catch (err) {
    next(err);
  }
});

//GET /api/v#/sports/:id
//Get one sport by id
sportRouter.get("/:id", auth(), async (req, res, next) => {
  try {
    let sport = await Sport.findOne({
      where: {
        id: req.params.id,
        organizationId: req.user.organizationId
      },
      attributes: {
        exclude: ["organizationId"]
      }
    });
    res.json(sport);
  } catch (err) {
    next(err);
  }
});

//PUT /api/v#/sports/:id
//Update one sport by id
sportRouter.put("/:id", auth(["isAdmin"]), async (req, res, next) => {
  const reqSport = req.body;
  try {
    await Sport.update(
      {
        name: reqSport.name,
        gender: reqSport.gender,
        sizes: reqSport.sizes
      },
      {
        where: {
          id: req.params.id,
          organizationId: req.user.organizationId
        }
      }
    );
    let sport = await Sport.findOne({
      where: {
        id: req.params.id
      },
      attributes: {
        exclude: ["organizationId"]
      }
    });
    res.json(sport);
  } catch (err) {
    next(err);
  }
});

//GET /api/v#/sports/:id
//Delete one sport by id
sportRouter.delete("/:id", auth(["isAdmin"]), async (req, res, next) => {
  try {
    await Sport.destroy({
      where: {
        id: req.params.id,
        organizationId: req.user.organizationId
      }
    });
    res.send("Sport " + req.params.id + " deleted.");
  } catch (err) {
    next(err);
  }
});

sportRouter.put("/user/:id", auth(["isAdmin", "isEmployee", "isCoach"]), async (req, res, next) => {
    let putSports = req.body.sports;
  try {
      let userSports = await PlayerSport.findAll({
          where: {
              userId: req.params.id
          }
      }).map(sport => sport.sportId);
      let addSports = putSports.filter(sport => !userSports.includes(sport));
      let deleteSports = userSports.filter(sport => !putSports.includes(sport));

      for (let sport of addSports) {
        await PlayerSport.create({
          userId: req.params.id,
          sportId: sport
        });
      }
      for (let sport of deleteSports) {
        await PlayerSport.destroy({
          where: {
            userId: req.params.id,
            sportId: sport
          }
        });
      }
      let user = await User.findOne({
        where: {
          id: req.params.id
        },
        include: [
          {
            model: Sport,
            through: { attributes: []}
          }
        ]
      });
      res.json(user.sports);
  } catch (err) {
    next(err);
  }
});

module.exports = sportRouter;
