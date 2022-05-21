module.exports = (sequelize, Sequelize) => {
    const Pool = sequelize.define("Pool", {
        user_id: {
            type: Sequelize.INTEGER
        },
        worthless_amount: {
            type: Sequelize.FLOAT,
            defaultValue: 0,
        },
        bnb: {
            type: Sequelize.FLOAT,
            defaultValue: 0,
        },
        recot_amount: {
            type: Sequelize.FLOAT,
            defaultValue: 0,
        },
        start_date: {
            type: Sequelize.STRING,
        },
        end_date: {
            type: Sequelize.STRING,
        }
    });
    return Pool;
};
