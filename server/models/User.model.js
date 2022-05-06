module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("User", {
        wallet_address: {
            type: Sequelize.STRING
        },
        spend_recot: {
            type: Sequelize.FLOAT,
            defaultValue: 0,
        }
    });
    return User;
};
