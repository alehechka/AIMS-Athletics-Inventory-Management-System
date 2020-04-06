"use strict";

const express = require("express");
const Sequelize = require("sequelize");
const { Sport, UserSport, User } = require("../models/database");
const auth = require("../middleware/auth");
const queryParams = require("../middleware/queryParams");
const sportRouter = express.Router();

//POST /api/v#/sports
//Create new sport
sportRouter.post("/", auth(["isAdmin"]), async (req, res, next) => {
  const sport = req.body;
  try {
    let createdSport = await Sport.create({
      name: sport.name,
      gender: sport.gender,
      icon: sport.icon,
      organizationId: req.user.organizationId
    });
    res.json(createdSport);
  } catch (err) {
    next(err);
  }
});

//GET /api/v#/sports
//Get all sports
sportRouter.get("/", auth(), queryParams([], ["id"]), async (req, res, next) => {
  try {
    let sports = await Sport.findAll({
      where: Sequelize.and({ organizationId: req.user.organizationId }, req.query.id ? { id: req.query.id } : null),
      attributes: {
        exclude: ["organizationId"]
      }
    });
    res.json(req.query.id && sports.length ? sports[0] : sports);
  } catch (err) {
    next(err);
  }
});

//PUT /api/v#/sports/:id
//Update one sport by id
sportRouter.put("/", auth(["isAdmin"]), queryParams(["id"]), async (req, res, next) => {
  const reqSport = req.body;
  try {
    await Sport.update(
      {
        name: reqSport.name,
        gender: reqSport.gender,
        icon: reqSport.icon
      },
      {
        where: {
          id: req.query.id,
          organizationId: req.user.organizationId
        }
      }
    );
    let sport = await Sport.findOne({
      where: {
        id: req.query.id
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
// sportRouter.delete("/", auth(["isAdmin"]), queryParams(["id"]), async (req, res, next) => {
//   try {
//     await Sport.destroy({
//       where: {
//         id: req.query.id,
//         organizationId: req.user.organizationId
//       }
//     });
//     res.send("Sport " + req.query.id + " deleted.");
//   } catch (err) {
//     next(err);
//   }
// });

sportRouter.put("/user", auth(["isAdmin", "isEmployee"]), queryParams(["userId"]), async (req, res, next) => {
  res.json(await updateUserSports(req.query.userId, req.body.sports));
});

async function updateUserSports(userId, sports) {
  sports = sports.map((sport) => {
    return sport.id || sport;
  });
  try {
    let userSports = await Sport.findAll({
      where: {
        default: false
      },
      include: [
        {
          model: User,
          where: {
            id: userId
          },
          attributes: []
        }
      ]
    }).map(sport => sport.id)
    let addSports = sports.filter((sport) => !userSports.includes(sport));
    let deleteSports = userSports.filter((sport) => !sports.includes(sport));

    for (let sport of addSports) {
      await UserSport.create({
        userId,
        sportId: sport
      });
    }
    for (let sport of deleteSports) {
      await UserSport.destroy({
        where: {
          userId,
          sportId: sport,
        }
      });
    }
    let user = await User.findOne({
      where: {
        id: userId
      },
      include: [
        {
          model: Sport,
          through: { attributes: [] },
          attributes: {
            exclude: ["organizationId"]
          }
        }
      ]
    });
    return user.sports;
  } catch (err) {
    throw err;
  }
};

async function getCoachSports(credentialId) {
  return await Sport.findAll({
    where: {
      default: false
    },
    attributes: ["id"],
    include: [
      {
        model: User,
        where: {
          credentialId
        }
      }
    ]
  }).map((sport) => {
    return sport.id;
  });
}

module.exports = { sportRouter, updateUserSports, getCoachSports };
