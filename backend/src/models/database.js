
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

const users = db.define('users', {
    school_id: { type: Sequelize.STRING, unique: true, allowNull: false },
    first_name: { type: Sequelize.STRING, allowNull: false },
    last_name: { type: Sequelize.STRING, allowNull: false },
    email: { type: Sequelize.STRING, validate: { isEmail: true }, allowNull: true },
    address: { type: Sequelize.STRING, allowNull: true },
    city: { type: Sequelize.STRING, allowNull: true },
    state: { type: Sequelize.STRING, allowNull: true },
    zip: { type: Sequelize.INTEGER, min: 10000, max: 99999, allowNull: true },
    phone: { type: Sequelize.INTEGER, allowNull: true },
    locker_number: { type: Sequelize.INTEGER, allowNull: true },
    locker_code: { type: Sequelize.INTEGER, allowNull: true },
    gender: { type: Sequelize.STRING(1), allowNull: true },
    height: { type: Sequelize.INTEGER, comment: 'in inches', allowNull: true },
    weight: { type: Sequelize.INTEGER, comment: 'in pounds', allowNull: true },
}, {
    timestamps: true
});

/////// STATUS ///////////////////////////////////////////////////////////////////////////

const status = db.define('statuses', {
    name: { type: Sequelize.STRING, allowNull: false },
    academic: { type: Sequelize.INTEGER, allowNull: true }
});

status.hasMany(users);
users.belongsTo(status);

/////// ROLES ///////////////////////////////////////////////////////////////////////////

const roles = db.define('roles', {
    name: { type: Sequelize.STRING, allowNull: false },
    description: { type: Sequelize.STRING, allowNull: true },
    check_in: { type: Sequelize.BOOLEAN, allowNull: true },
    check_out: { type: Sequelize.BOOLEAN, allowNull: true },
}, {
    timestamps: true
});

roles.hasMany(users);
users.belongsTo(roles);

/////// SPORTS ///////////////////////////////////////////////////////////////////////////

const sports =  db.define('sports', {
    name: { type: Sequelize.STRING, allowNull: false },
    gender: { type: Sequelize.STRING(1), allowNull: false}
});

/////// PLAYER_SPORTS ///////////////////////////////////////////////////////////////////////////

const player_sports =  db.define('player_sports', {});

users.hasMany(player_sports);
player_sports.belongsTo(users);

sports.hasMany(player_sports);
player_sports.belongsTo(sports);

/////// INVENTORY ///////////////////////////////////////////////////////////////////////////

const inventory = db.define('inventories', {
    name: { type: Sequelize.STRING, allowNull: false },
    description: { type: Sequelize.STRING, allowNull: true },
    size: { type: Sequelize.STRING, allowNull: false },
    remaining: { type: Sequelize.INTEGER, allowNull: false },
    price: { type: Sequelize.DOUBLE, allowNull: true },
    total: { type: Sequelize.INTEGER, allowNull: false },
}, {
    timestamps: true
});

sports.hasMany(inventory);
inventory.belongsTo(sports);


/////// EQUIPMENT ///////////////////////////////////////////////////////////////////////////

const equipment = db.define('equipment', {
    size: { type: Sequelize.STRING, allowNull: false },
    count: { type: Sequelize.INTEGER, allowNull: false },
    returned_on: { type: Sequelize.DATE, allowNull: true }
}, {
    timestamps: true
});

users.hasMany(equipment);
equipment.belongsTo(users);

inventory.hasMany(equipment);
equipment.belongsTo(inventory);

/////// TRANSACTIONS ///////////////////////////////////////////////////////////////////////////

const transactions = db.define('transactions', {
    amount: { type: Sequelize.INTEGER, allowNull: false }
}, {
    timestamps: true
});

equipment.hasMany(transactions);
transactions.belongsTo(equipment);

users.hasMany(transactions, {
    foreignKey: 'issued_by'
  });
transactions.belongsTo(users, {
    foreignKey: 'issued_by'
  });
  
users.hasMany(transactions, {
    foreignKey: 'issued_to'
  });
transactions.belongsTo(users, {
    foreignKey: 'issued_to'
  });

/////// PLAYER_SIZES ///////////////////////////////////////////////////////////////////////////
// Add categories from Front Rush
const player_sizes = db.define('player_sizes', {
    bottom: { type: Sequelize.DATE, allowNull: true },
    socks: { type: Sequelize.DATE, allowNull: true },
    shows: { type: Sequelize.DATE, allowNull: true },
    womens_polo: { type: Sequelize.DATE, allowNull: true },
    bags: { type: Sequelize.DATE, allowNull: true },
    t_shirt: { type: Sequelize.DATE, allowNull: true },
    mens_shoes: { type: Sequelize.DATE, allowNull: true },
    shorts: { type: Sequelize.DATE, allowNull: true },
    sweat_top: { type: Sequelize.DATE, allowNull: true },
    sports_bra: { type: Sequelize.DATE, allowNull: true },
    womens_shoes: { type: Sequelize.DATE, allowNull: true },
    flex_fit_hats: { type: Sequelize.DATE, allowNull: true },
    womens_bottom: { type: Sequelize.DATE, allowNull: true },
    womens_jacket: { type: Sequelize.DATE, allowNull: true },
    sweatshirt: { type: Sequelize.DATE, allowNull: true },
    mens_polo: { type: Sequelize.DATE, allowNull: true },
    generic_apperel: { type: Sequelize.DATE, allowNull: true },
    jacket: { type: Sequelize.DATE, allowNull: true },
    sweat_pants: { type: Sequelize.DATE, allowNull: true },
    tights: { type: Sequelize.DATE, allowNull: true },
}, {
    timestamps: true
});

users.hasOne(player_sizes);
player_sizes.belongsTo(users);

//Uncomment when making changes to the table or need to create table in new environment
//db.sync({ force: true, alter: true });

module.exports = { users, roles, inventory, equipment, transactions, player_sizes, player_sports, sports, status };

