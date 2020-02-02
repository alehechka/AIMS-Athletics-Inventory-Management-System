
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
    academic_year: { type: Sequelize.STRING, allowNull: true },
}, {
    timestamps: true
});

//Uncomment when making changes to the table or need to create table in new environment
//users.sync({ alter: true });

module.exports = users;

