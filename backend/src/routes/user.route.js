"use strict";

const express = require("express");
const Sequelize = require("sequelize");
const auth = require("../middleware/auth");
const queryParams = require("../middleware/queryParams");
const {
  User,
  UserSport,
  Sport,
  UserSize,
  Credential,
  SportSize,
  Status,
  hashPassword,
  addDisplayNameToSports
} = require("../models/database");
const userRouter = express.Router();
const { updateUserSports } = require("./sport.route");

//POST /api/v#/users
//Allows an admin to create a new user profile with temporary login credentials
userRouter.post("/", auth(["isAdmin"]), async (req, res, next) => {
  const user = req.body;
  try {
    let createdCred = await Credential.create({
      email: user.email,
      username: user.username,
      password: await hashPassword(user["password"] || "password123"),
      organizationId: req.user.organizationId,
      isAdmin: user.isAdmin,
      isEmployee: user.isEmployee,
      isCoach: user.isCoach,
      isAthlete: user.isAthlete
    });
    let createdUser = await User.create({
      schoolId: user.schoolId,
      firstName: user.firstname,
      lastName: user.lastName,
      address: user.address,
      city: user.city,
      state: user.state,
      zip: user.zip,
      phone: user.phone,
      gender: user.gender,
      height: user.height,
      weight: user.weight,
      lockerNumber: user.lockerNumber,
      lockerCode: user.lockerCode,
      credentialId: createdCred.id,
      organizationId: req.user.organizationId,
      isActive: user.isActive === true || user.isActive === false ? user.isActive : true,
      statusId: user.statusId
    });
    //This needs to be changed to be the "Admin" for whichever organization they are in
    await Sport.findOne({
      where: {
        organizationId: req.user.organizationId,
        default: true
      }
    }).then(async (sport) => {
      await UserSport.create({
        userId: createdUser.id,
        sportId: sport.id
      });
    });
    if (user.sports) {
      await updateUserSports(createdUser.id, user.sports);
    }
    if (user.userSizes) {
      await updateUserSizes(createdUser.id, user.userSizes);
    }
    res.json(await getUsers(req.user, {userId: createdUser.id}));
  } catch (err) {
    next(err);
  }
});

//GET /api/v#/users
//Retrieve all users
//URL Query Params: page, limit, id
userRouter.get(
  "/",
  auth(["isAdmin", "isEmployee", "isCoach"]),
  queryParams([], ["page", "limit", "id", "gender", "sports[]", "isAdmin", "isEmployee", "isCoach", "isAthlete"]),
  async (req, res, next) => {
    try {
      res.json(await getUsers(req.user, {
        page: req.query.page,
        limit: req.query.limit,
        userId: req.query.id,
        gender: req.query.gender,
        sports: req.query["sports[]"],
        isAdmin: req.query.isAdmin,
        isEmployee: req.query.isEmployee,
        isCoach: req.query.isCoach,
        isAthlete: req.query.isAthlete,
      }));
    } catch (err) {
      next(err);
    }
  }
);

//GET /api/v#/users/current
//Retrieves the currently logged in user
userRouter.get("/current", auth(), async (req, res, next) => {
  try {
    res.json(await getUsers(req.user, {credentialId: req.user.id}));
  } catch (err) {
    next(err);
  }
});

//PUT /api/v#/users/current
//Updates the currently logged in user
userRouter.put("/current", auth(), async (req, res, next) => {
  let putUser = req.body;
  try {
    let user = await getUsers(req.user, {credentialId: req.user.id});
    if (req.user.isAdmin) {
      user.schoolId = putUser.schoolId;
    }
    if (req.user.isAdmin || req.user.isEmployee) {
      user.lockerNumber = putUser.lockerNumber;
      user.lockerCode = putUser.lockerCode;
      user.statusId = putUser.statusId;
      user.isActive = putUser.isActive === true || putUser.isActive === false ? putUser.isActive : true;
      if (putUser.sports) {
        await updateUserSports(user.id, putUser.sports);
      }
    }
    if (putUser.userSizes) {
      await updateUserSizes(user.id, putUser.userSizes);
    }
    user.firstName = putUser.firstname;
    user.lastName = putUser.lastName;
    user.address = putUser.address;
    user.city = putUser.city;
    user.state = putUser.state;
    user.zip = putUser.zip;
    user.phone = putUser.phone;

    user.gender = putUser.gender;
    user.height = putUser.height;
    user.weight = putUser.weight;
    await user.save();
    res.json(await user.reload());
  } catch (err) {
    next(err);
  }
});

//PUT /api/v#/users
//Updates the selected user (only by admin or employee)
//Required URL Query Param: userId
userRouter.put("/", auth(["isAdmin", "isEmployee"]), queryParams(["id"]), async (req, res, next) => {
  let putUser = req.body;
  try {
    let foundUser = await getUsers(req.user, {userId: req.query.id});
    if (req.user.isAdmin) {
      foundUser.schoolId = putUser.schoolId;
    }
    if (putUser.sports) {
      user.userSports = await updateUserSports(foundUser.id, putUser.sports);
    }
    if (putUser.userSizes) {
      user.userSizes = await updateUserSizes(user.id, putUser.userSizes);
    }
    foundUser.lockerNumber = putUser.lockerNumber;
    foundUser.lockerCode = putUser.lockerCode;
    foundUser.firstName = putUser.firstname;
    foundUser.lastName = putUser.lastName;
    foundUser.address = putUser.address;
    foundUser.city = putUser.city;
    foundUser.state = putUser.state;
    foundUser.zip = putUser.zip;
    foundUser.phone = putUser.phone;
    foundUser.gender = putUser.gender;
    foundUser.height = putUser.height;
    foundUser.weight = putUser.weight;
    foundUser.statusId = putUser.statusId;
    foundUser.isActive = putUser.isActive === true || putUser.isActive === false ? putUser.isActive : true;
    await foundUser.save();
    res.json(await foundUser.reload());
  } catch (err) {
    next(err);
  }
});

async function getUsers(user, {
  page,
  limit,
  userId,
  credentialId,
  gender,
  sports,
  isAdmin,
  isEmployee,
  isCoach,
  isAthlete
}) {
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
    let allUsers = await User.findAll({
      offset,
      //limit: pageLimit, //limit gets placed in the wrong location in the SQL query and caused nothing to return
      where: Sequelize.and(
        { organizationId: user.organizationId },
        credentialId ? { credentialId: user.id } : null,
        userId ? { id: userId } : null,
        gender ? { gender } : null
      ),
      attributes: {
        exclude: ["createdAt", "updatedAt", "credentialId", "organizationId", "statusId"]
      },
      include: [
        {
          model: Sport,
          attributes: ["id", "name", "gender", "displayName", "icon"],
          through: { attributes: [] },
          where: Sequelize.and(
            sports ? Sequelize.or({ id: sports }) : null,
            user.highestAccess.isCoach ? Sequelize.or({ id: coachSports }) : null
          ),
          include: [
            {
              model: SportSize,
              attributes: userId || credentialId ? ["sportId", "name", "sizes"] : []
            }
          ]
        },
        {
          model: UserSize,
          attributes: userId || credentialId ? ["id", "sportSizeId", "size"] : []
        },
        {
          model: Credential,
          attributes: user.isAdmin ? { exclude: ["organizationId", "password"] } : ["email", "username"],
          where:
            isAdmin || isEmployee || isCoach || isAthlete
              ? Sequelize.or(
                  isAdmin ? { isAdmin } : null,
                  isEmployee ? { isEmployee } : null,
                  isCoach ? { isCoach } : null,
                  isAthlete ? { isAthlete } : null
                )
              : null
        },
        {
          model: Status
        }
      ]
    });
    for (let user of allUsers) {
      user.sports = await addDisplayNameToSports(user.sports);
    }
    return (userId || credentialId) && allUsers.length ? allUsers[0] : allUsers;
  } catch (err) {
    console.log(err)
    throw err;
  }
}

async function updateUserSizes(userId, sizes) {
  try {
    let userSizes = await UserSize.findAll({
      where: {
        userId
      }
    });

    let addSizes = sizes.filter((size) => {
      return !userSizes.map((userSize) => userSize.sportSizeId).includes(size.sportSizeId);
    });
    let updateSizes = sizes.filter((size) => {
      return userSizes.map((userSize) => userSize.sportSizeId).includes(size.sportSizeId);
    });
    let deleteSizes = userSizes.filter((userSize) => {
      return !sizes.map((size) => size.sportSizeId).includes(userSize.sportSizeId);
    });

    for (let size of addSizes) {
      await UserSize.create({
        userId,
        sportSizeId: size.sportSizeId,
        size: size.size
      });
    }

    for (let size of updateSizes) {
      await UserSize.update(
        {
          size: size.size
        },
        {
          where: {
            userId,
            sportSizeId: size.sportSizeId
          }
        }
      );
    }

    for (let size of deleteSizes) {
      await UserSize.destroy({
        where: {
          userId,
          sportSizeId: size.sportSizeId
        }
      });
    }

    return await await UserSize.findAll({
      where: {
        userId
      }
    });
  } catch (err) {
    throw err;
  }
}

module.exports = userRouter;
