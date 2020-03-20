"use strict";

require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });
const { DB_HOST, DB_DATABASE, DB_USER, DB_PASSWORD } = process.env;

console.log(DB_HOST, DB_DATABASE, DB_USER, DB_PASSWORD)

const bcrypt = require("bcrypt");
const Sequelize = require("sequelize");

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
  logo: { type: Sequelize.BLOB, allowNull: true }
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
      defaultValue: false
    },
    isCoach: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false }
  },
  {
    hooks: {
      beforeValidate: async (credential, options) => {
        credential.username =
          credential["username"] || credential.email.split("@")[0];
        credential.password = await bcrypt.hash(credential.password, 10);
      }
    }
  }
);

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
    phone: { type: Sequelize.INTEGER, allowNull: true },
    lockerNumber: { type: Sequelize.INTEGER, allowNull: true },
    lockerCode: { type: Sequelize.INTEGER, allowNull: true },
    gender: { type: Sequelize.STRING(1), allowNull: true },
    height: { type: Sequelize.INTEGER, comment: "in inches", allowNull: true },
    weight: { type: Sequelize.INTEGER, comment: "in pounds", allowNull: true }
  },
  {
    timestamps: true
  }
);

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
//All players will be contained inside a "base sport" that will contain the standard equipment that all athletes need
const Sport = db.define("sports", {
  name: { type: Sequelize.STRING, allowNull: false },
  gender: { type: Sequelize.STRING(1), allowNull: false }
});

Organization.hasMany(Sport, { foreignKey: { allowNull: false } });
Sport.belongsTo(Organization, { foreignKey: { allowNull: false } });

/////// PLAYER_SIZES ////////////////////////////////////////////////////////////////////////////

const SportSize = db.define("sport_sizes", {
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

/////// PLAYER_SPORTS ///////////////////////////////////////////////////////////////////////////

const PlayerSport = db.define("player_sports", {});

User.belongsToMany(Sport, { through: "player_sports" });
Sport.belongsToMany(User, { through: "player_sports" });

/////// INVENTORY ///////////////////////////////////////////////////////////////////////////
//Inventory that the school has.
const Inventory = db.define(
  "inventories",
  {
    name: { type: Sequelize.STRING, allowNull: false },
    description: { type: Sequelize.STRING, allowNull: true },
    surplus: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
    taxable: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
    expendable: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false }
  },
  {
    timestamps: true
  }
);

SportSize.hasMany(Inventory);
Inventory.belongsTo(SportSize);

Organization.hasMany(Inventory, { foreignKey: { allowNull: false } });
Inventory.belongsTo(Organization, { foreignKey: { allowNull: false } });

const InventorySize = db.define(
  "inventory_sizes",
  {
    size: { type: Sequelize.STRING, allowNull: false },
    barcode: { type: Sequelize.STRING, allowNull: true },
    price: { type: Sequelize.DECIMAL, allowNull: true },
    quantity: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
  },
  {
    timestamps: true
  }
);

Inventory.hasMany(InventorySize);
InventorySize.belongsTo(Inventory);

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
    returned: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false }
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

/////// PLAYER_SIZES ///////////////////////////////////////////////////////////////////////////
/*
  sizes: [
      {
          name: "T-Shirt",
          value: "XL"
      }
  ]
*/
const PlayerSize = db.define(
  "player_sizes",
  {
    size: { type: Sequelize.STRING, allowNull: false }
  },
  {
    timestamps: false
  }
);

User.hasMany(PlayerSize, { foreignKey: { allowNull: false } });
PlayerSize.belongsTo(User, { foreignKey: { allowNull: false } });

SportSize.hasMany(PlayerSize, { foreignKey: { allowNull: false } });
PlayerSize.belongsTo(SportSize, { foreignKey: { allowNull: false } });

//Uncomment when making changes to the table or need to create table in new environment
//db.sync({ force: true, alter: true });

module.exports = {
  User,
  Inventory,
  InventorySize,
  Equipment,
  Transaction,
  PlayerSize,
  PlayerSport,
  Sport,
  SportSize,
  Status,
  Credential,
  Organization,
  db
};
