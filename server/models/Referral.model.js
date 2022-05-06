module.exports = (sequelize, Sequelize) => {
    const Referral = sequelize.define("Referral", {
        user_id: {
            type: Sequelize.INTEGER
        },
        friend_id: {
            type: Sequelize.INTEGER
        },
    });
    return Referral;
};
