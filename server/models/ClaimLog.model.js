module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("ClaimLog", {
        user_id: {
            type: Sequelize.INTEGER
        },
        claim_amount: {
            type: Sequelize.FLOAT,
            defaultValue: 0,
        }
    });
    return User;
};
