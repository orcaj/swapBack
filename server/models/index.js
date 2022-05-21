const dbConfig = require("../config");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: false,
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
});
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.user = require("./User.model")(sequelize, Sequelize);
db.referral = require("./Referral.model")(sequelize, Sequelize);
db.claimLog = require("./ClaimLog.model")(sequelize, Sequelize);
db.pool = require("./Pool.model")(sequelize, Sequelize);

module.exports = db;
