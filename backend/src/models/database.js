"use strict";

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const { DB_HOST, DB_DATABASE, DB_USER, DB_PASSWORD } = process.env;
const bcrypt = require("bcrypt");
const Sequelize = require("sequelize");
const { DataTypes } = require("sequelize");

const db = new Sequelize(DB_DATABASE, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  dialect: "postgres",
  logging: false,
  dialectOptions: {
    options: {
      useUTC: false,
      dateFirst: 1
    }
  },
  define: {
    timestamps: false
  }
});

/////// ORGANIZATIONS ///////////////////////////////////////////////////////////////////////////

const Organization = db.define("organizations", {
  name: { type: Sequelize.STRING, allowNull: false },
  shortName: { type: Sequelize.STRING, allowNull: true },
  address: { type: Sequelize.STRING, allowNull: true },
  city: { type: Sequelize.STRING, allowNull: true },
  state: { type: Sequelize.STRING, allowNull: true },
  zip: { type: Sequelize.INTEGER, min: 10000, max: 99999, allowNull: true },
  phone: { type: Sequelize.INTEGER, allowNull: true },
  primaryColor: { type: Sequelize.STRING(6), allowNull: true },
  secondaryColor: { type: Sequelize.STRING(6), allowNull: true },
  logo: { type: Sequelize.STRING, allowNull: true }
});

/////// USERS ///////////////////////////////////////////////////////////////////////////

const Credential = db.define(
  "credentials",
  {
    email: {
      type: Sequelize.STRING,
      unique: true,
      validate: { isEmail: true },
      allowNull: false
    },
    username: { type: Sequelize.STRING, unique: true, allowNull: false },
    password: { type: Sequelize.STRING, unique: false, allowNull: false },
    isAdmin: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
    isEmployee: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    isAthlete: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    isCoach: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
    isApproved: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
    isVerified: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false }
  },
  {
    hooks: {
      beforeValidate: async (credential, options) => {
        credential.username = credential["username"] || credential.email.split("@")[0];
      }
    }
  }
);

//This functions makes it so all hashing of passwords use the same salt.
const hashPassword = async (password) => {
  return await await bcrypt.hash(password, 10);
};

Organization.hasMany(Credential, { foreignKey: { allowNull: false } });
Credential.belongsTo(Organization), { foreignKey: { allowNull: false } };

const User = db.define(
  "users",
  {
    schoolId: { type: Sequelize.STRING, allowNull: true },
    firstName: { type: Sequelize.STRING, allowNull: true },
    lastName: { type: Sequelize.STRING, allowNull: true },
    address: { type: Sequelize.STRING, allowNull: true },
    city: { type: Sequelize.STRING, allowNull: true },
    state: { type: Sequelize.STRING, allowNull: true },
    zip: { type: Sequelize.INTEGER, min: 10000, max: 99999, allowNull: true },
    phone: { type: Sequelize.STRING, allowNull: true },
    lockerNumber: { type: Sequelize.STRING, allowNull: true },
    lockerCode: { type: Sequelize.STRING, allowNull: true },
    gender: { type: Sequelize.STRING(1), allowNull: true },
    height: { type: Sequelize.INTEGER, comment: "in inches", allowNull: true },
    weight: { type: Sequelize.INTEGER, comment: "in pounds", allowNull: true },
    isActive: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
    jerseyNumber: { type: Sequelize.INTEGER, allowNull: true },
    fullName: { type: Sequelize.VIRTUAL },
    role: {type: Sequelize.VIRTUAL }
  },
  {
    timestamps: true,
    hooks: {
      afterFind: async (users, options) => {
        users = addFullNameToUsers(users);
      }
    }
  }
);

function addFullNameToUsers(users) {
  if (users.length) {
    for (let user of users) {
      let fullName = (user.firstName ? user.firstName : "") + (user.lastName ? " " + user.lastName : "");
      user.fullName = fullName || null;
      if(user.credential) {
        user.role = getRole(user.credential);
      }
    }
  } else {
    let fullName = (users.firstName ? users.firstName : "") + (users.lastName ? " " + users.lastName : "");
    users.fullName = fullName || null;
    if(users.credential) {
      users.role = getRole(users.credential);
    }
    return users;
  }
}

function getRole(credentials) {
  let role = "Athlete";
  if (credentials.isAdmin) {
    role = "Admin";
  } else if (credentials.isEmployee) {
    role = "Employee";
  } else if (credentials.isCoach) {
    role = "Coach";
  } else if (credentials.isAthlete) {
    role = "Athlete";
  }
  return role;
};

Credential.hasOne(User, {
  foreignKey: { allowNull: false, unique: true },
  onDelete: "CASCADE"
});
User.belongsTo(Credential, {
  foreignKey: { allowNull: false, unique: true },
  onDelete: "CASCADE"
});

Organization.hasMany(User, { foreignKey: { allowNull: false } });
User.belongsTo(Organization, { foreignKey: { allowNull: false } });

/////// STATUS ///////////////////////////////////////////////////////////////////////////

const Status = db.define("statuses", {
  name: { type: Sequelize.STRING, allowNull: false },
  academicYear: { type: Sequelize.INTEGER, allowNull: true }
});

Status.hasMany(User);
User.belongsTo(Status);

/////// SPORTS //////////////////////////////////////////////////////////////////////////
//All users will be contained inside a "base sport" that will contain the standard equipment that all athletes need
const Sport = db.define(
  "sports",
  {
    name: { type: Sequelize.STRING, allowNull: false },
    gender: { type: Sequelize.STRING(1), allowNull: true },
    icon: { type: Sequelize.STRING, allowNull: true },
    default: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
    displayName: { type: Sequelize.VIRTUAL }
  },
  {
    hooks: {
      afterFind: async (sports, options) => {
        sports = addDisplayNameToSports(sports);
      }
    }
  }
);

function addDisplayNameToSports(sports) {
  if (sports.length) {
    for (let sport of sports) {
      sport.displayName = `${sport.name}` + (sport.gender ? ` (${sport.gender})` : "");
    }
  } else {
    sports.displayName = `${sports.name}` + (sports.gender ? ` (${sports.gender})` : "");
  }
  return sports;
}

Organization.hasMany(Sport, { foreignKey: { allowNull: false } });
Sport.belongsTo(Organization, { foreignKey: { allowNull: false } });

/////// SPORT_SIZES ////////////////////////////////////////////////////////////////////////////

const SportSize = db.define(
  "sportSizes",
  {
    name: { type: Sequelize.STRING, allowNull: false },
    sizes: { type: Sequelize.JSON, allowNull: false, defaultValue: [] }
    //sizes: ["XL", "L", "M"]
  },
  {
    timestamps: false
  }
);

Sport.hasMany(SportSize, { foreignKey: { allowNull: false } });
SportSize.belongsTo(Sport, { foreignKey: { allowNull: false } });

/////// USER_SPORTS ///////////////////////////////////////////////////////////////////////////

const UserSport = db.define("userSports", {});

User.belongsToMany(Sport, { through: "userSports" });
Sport.belongsToMany(User, { through: "userSports" });

/////// TEAMS ///////////////////////////////////////////////////////////////////////////////

const Team = db.define("teams", {
  name: { type: Sequelize.STRING, allowNull: false },
  description: { type: Sequelize.STRING, allowNull: true },
  schoolYear: { type: Sequelize.INTEGER, allowNull: true },
  season: { type: DataTypes.STRING, allowNull: true }
});

Sport.hasMany(Team, { foreignKey: { allowNull: false } });
Team.belongsTo(Sport, { foreignKey: { allowNull: false } });

const TeamMember = db.define("teamMembers", {});

User.belongsToMany(Team, { through: "teamMembers" });
Team.belongsToMany(User, { through: "teamMembers" });

/////// INVENTORY ///////////////////////////////////////////////////////////////////////////
//Inventory that the school has.
const Inventory = db.define(
  "inventories",
  {
    name: { type: Sequelize.STRING, allowNull: false },
    description: { type: Sequelize.STRING, allowNull: true },
    color: { type: Sequelize.STRING, allowNull: true }, 
    surplus: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
    taxable: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
    expendable: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
    totalQuantity: { type: Sequelize.VIRTUAL },
    averagePrice: { type: Sequelize.VIRTUAL }
  },
  {
    timestamps: true,
    hooks: {
      afterFind: async (inventories, options) => {
        if (inventories.length) {
          for (let index in inventories) {
            inventories[index].totalQuantity = await InventorySize.sum("quantity", {
              where: { inventoryId: inventories[index].id }
            });
            inventories[index].averagePrice =
              (await InventorySize.sum("price", { where: { inventoryId: inventories[index].id } })) /
              (await InventorySize.count({ where: { inventoryId: inventories[index].id } }));
          }
        } else {
          inventories.totalQuantity = await InventorySize.sum("quantity", {
            where: { inventoryId: inventories.id }
          });
          inventories.averagePrice =
            (await InventorySize.sum("price", { where: { inventoryId: inventories.id } })) /
            (await InventorySize.count({ where: { inventoryId: inventories.id } }));
        }
      }
    }
  }
);

Sport.hasMany(Inventory, { foreignKey: { allowNull: false } });
Inventory.belongsTo(Sport, { foreignKey: { allowNull: false } });

SportSize.hasMany(Inventory, { foreignKey: { allowNull: false } });
Inventory.belongsTo(SportSize, { foreignKey: { allowNull: false } });

Organization.hasMany(Inventory, { foreignKey: { allowNull: false } });
Inventory.belongsTo(Organization, { foreignKey: { allowNull: false } });

const InventorySize = db.define(
  "inventorySizes",
  {
    size: { type: Sequelize.STRING, allowNull: false },
    barcode: { type: Sequelize.STRING, allowNull: true },
    price: { type: Sequelize.DECIMAL, allowNull: true },
    quantity: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
    alertQuantity: { type: Sequelize.INTEGER, allowNull: true, defaultValue: 0 },
    jerseyNumbers: { type: Sequelize.JSON, allowNull: true, defaultValue: [] }
  },
  {
    timestamps: true
  }
);

Inventory.hasMany(InventorySize, { foreignKey: { allowNull: false } });
InventorySize.belongsTo(Inventory, { foreignKey: { allowNull: false } });

/////// EQUIPMENT ///////////////////////////////////////////////////////////////////////////
//Equipment that users have.
const Equipment = db.define(
  "equipment",
  {
    count: { type: Sequelize.INTEGER, allowNull: false }
  },
  {
    timestamps: true
  }
);

User.hasMany(Equipment, { foreignKey: { allowNull: false } });
Equipment.belongsTo(User, { foreignKey: { allowNull: false } });

InventorySize.hasMany(Equipment, { foreignKey: { allowNull: false } });
Equipment.belongsTo(InventorySize, { foreignKey: { allowNull: false } });

Organization.hasMany(Equipment, { foreignKey: { allowNull: false } });
Equipment.belongsTo(Organization, { foreignKey: { allowNull: false } });

/////// TRANSACTIONS ///////////////////////////////////////////////////////////////////////////

const Transaction = db.define(
  "transactions",
  {
    amount: { type: Sequelize.INTEGER, allowNull: false },
    returned: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
    comment: { type: Sequelize.STRING, allowNull: true },
    price: { type: Sequelize.VIRTUAL }
  },
  {
    timestamps: true
  }
);

Equipment.hasMany(Transaction, { foreignKey: { allowNull: false } });
Transaction.belongsTo(Equipment, { foreignKey: { allowNull: false } });

User.hasMany(Transaction, {
  as: "IssuedBy",
  foreignKey: { name: "issuedBy", allowNull: false }
});
Transaction.belongsTo(User, {
  as: "IssuedBy",
  foreignKey: { name: "issuedBy", allowNull: false }
});

User.hasMany(Transaction, {
  as: "IssuedTo",
  foreignKey: { name: "issuedTo", allowNull: false }
});
Transaction.belongsTo(User, {
  as: "IssuedTo",
  foreignKey: { name: "issuedTo", allowNull: false }
});

Organization.hasMany(Transaction, { foreignKey: { allowNull: false } });
Transaction.belongsTo(Organization, { foreignKey: { allowNull: false } });

/////// USER_SIZES ///////////////////////////////////////////////////////////////////////////
const UserSize = db.define(
  "userSizes",
  {
    size: { type: Sequelize.STRING, allowNull: false }
  },
  {
    timestamps: false
  }
);

User.hasMany(UserSize, { foreignKey: { allowNull: false }, unique: 'compositeIndex' });
UserSize.belongsTo(User, { foreignKey: { allowNull: false }, unique: 'compositeIndex' });

SportSize.hasMany(UserSize, { foreignKey: { allowNull: false }, unique: 'compositeIndex' });
UserSize.belongsTo(SportSize, { foreignKey: { allowNull: false }, unique: 'compositeIndex' });

module.exports = {
  User,
  addFullNameToUsers,
  Inventory,
  InventorySize,
  Equipment,
  Transaction,
  UserSize,
  UserSport,
  Sport,
  addDisplayNameToSports,
  SportSize,
  Status,
  Credential,
  hashPassword,
  Organization,
  Team,
  TeamMember,
  db
};
