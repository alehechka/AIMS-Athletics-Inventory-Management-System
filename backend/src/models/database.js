
require('mandatoryenv').load([
    'DB_HOST',
    'DB_DATABASE',
    'DB_USER',
    'DB_PASSWORD',
    'PORT',
    'API_VER'
]);
const {
    DB_HOST,
    DB_DATABASE,
    DB_USER,
    DB_PASSWORD
} = process.env;



const Sequelize = require( "sequelize");

const db = new Sequelize(DB_DATABASE, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    dialect: 'postgres',
    dialectOptions: {
        options: {
            useUTC: false,
            dateFirst: 1,
        }
    },
    define: {
        timestamps: false
    }
});

/////// USERS ///////////////////////////////////////////////////////////////////////////

const User = db.define('users', {
    schoolId: { type: Sequelize.STRING, unique: true, allowNull: false },
    firstName: { type: Sequelize.STRING, allowNull: false },
    lastName: { type: Sequelize.STRING, allowNull: false },
    email: { type: Sequelize.STRING, validate: { isEmail: true }, allowNull: true },
    address: { type: Sequelize.STRING, allowNull: true },
    city: { type: Sequelize.STRING, allowNull: true },
    state: { type: Sequelize.STRING, allowNull: true },
    zip: { type: Sequelize.INTEGER, min: 10000, max: 99999, allowNull: true },
    phone: { type: Sequelize.INTEGER, allowNull: true },
    lockerNumber: { type: Sequelize.INTEGER, allowNull: true },
    lockerCode: { type: Sequelize.INTEGER, allowNull: true },
    gender: { type: Sequelize.STRING(1), allowNull: true },
    height: { type: Sequelize.INTEGER, comment: 'in inches', allowNull: true },
    weight: { type: Sequelize.INTEGER, comment: 'in pounds', allowNull: true },
}, {
    timestamps: true
});

/////// STATUS ///////////////////////////////////////////////////////////////////////////

const Status = db.define('statuses', {
    name: { type: Sequelize.STRING, allowNull: false },
    academic: { type: Sequelize.INTEGER, allowNull: true }
});

Status.hasMany(User);
User.belongsTo(Status);

/////// ROLES ///////////////////////////////////////////////////////////////////////////

const Role = db.define('roles', {
    name: { type: Sequelize.STRING, allowNull: false },
    description: { type: Sequelize.STRING, allowNull: true },
    checkIn: { type: Sequelize.BOOLEAN, allowNull: true },
    checkOut: { type: Sequelize.BOOLEAN, allowNull: true },
}, {
    timestamps: true
});

Role.hasMany(User);
User.belongsTo(Role);

/////// SPORTS ///////////////////////////////////////////////////////////////////////////
/*
    sizes: [
        {
            name: "T-shirt",
            values: ["XL", "L", "M", "S"]
        }
    ]
*/
//All players will be contained inside a "base sport" that will contain the standard equipment that all athletes need
const Sport =  db.define('sports', {
    name: { type: Sequelize.STRING, allowNull: false },
    gender: { type: Sequelize.STRING(1), allowNull: false},
    sizes: { type: Sequelize.JSON, allowNull: true, comment: 'only used when sport has additional custom equipment'}
});

/////// PLAYER_SPORTS ///////////////////////////////////////////////////////////////////////////

const PlayerSport = db.define('player_sports', {});

User.hasMany(PlayerSport);
PlayerSport.belongsTo(User);

Sport.hasMany(PlayerSport);
PlayerSport.belongsTo(Sport);

/////// INVENTORY ///////////////////////////////////////////////////////////////////////////
//Inventory that the school has.
const Inventory = db.define('inventories', {
    name: { type: Sequelize.STRING, allowNull: false },
    description: { type: Sequelize.STRING, allowNull: true },
    size: { type: Sequelize.STRING, allowNull: false },
    remaining: { type: Sequelize.INTEGER, allowNull: false },
    price: { type: Sequelize.DOUBLE, allowNull: true },
    total: { type: Sequelize.INTEGER, allowNull: false },
}, {
    timestamps: true
});

Sport.hasMany(Inventory);
Inventory.belongsTo(Sport);


/////// EQUIPMENT ///////////////////////////////////////////////////////////////////////////
//Equipment that users have.
const Equipment = db.define('equipment', {
    size: { type: Sequelize.STRING, allowNull: false },
    count: { type: Sequelize.INTEGER, allowNull: false },
    returnedOn: { type: Sequelize.DATE, allowNull: true }
}, {
    timestamps: true
});

User.hasMany(Equipment);
Equipment.belongsTo(User);

Inventory.hasMany(Equipment);
Equipment.belongsTo(Inventory);

/////// TRANSACTIONS ///////////////////////////////////////////////////////////////////////////

const Transaction = db.define('transactions', {
    amount: { type: Sequelize.INTEGER, allowNull: false }
}, {
    timestamps: true
});

Equipment.hasMany(Transaction);
Transaction.belongsTo(Equipment);

User.hasMany(Transaction, {
    foreignKey: 'issuedBy'
  });
  Transaction.belongsTo(User, {
    foreignKey: 'issuedBy'
  });
  
  User.hasMany(Transaction, {
    foreignKey: 'issuedTo'
  });
  Transaction.belongsTo(User, {
    foreignKey: 'issuedTo'
  });

/////// PLAYER_SIZES ///////////////////////////////////////////////////////////////////////////
/*
  sizes: [
      {
          name: "T-Shirt",
          value: "XL"
      }
  ]
*/
const PlayerSize = db.define('player_sizes', {
    sizes: { type: Sequelize.JSON, allowNull: false}
}, {
    timestamps: true
});

User.hasOne(PlayerSize);
PlayerSize.belongsTo(User);

//Uncomment when making changes to the table or need to create table in new environment
//db.sync({ force: true, alter: true });

module.exports = { User, Role, Inventory, Equipment, Transaction, PlayerSize, PlayerSport, Sport, Status };

