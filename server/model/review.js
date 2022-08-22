module.exports = (sequelize, Sequelize) => {
    return REVIEW = sequelize.define("REVIEWS", {
        id: {
            type: Sequelize.INTEGER,
            field: "REVIEW_ID",
            primaryKey: 1,
            autoIncrement: 1      
        },
        SERVICE_ID: {
            type: Sequelize.INTEGER
        },
        RATING: {
            type: Sequelize.INTEGER
        }, 
        FEEDBACK: {
            type: Sequelize.TEXT
        }
    }, {
        timestamps: false,

        // If don't want createdAt
        createdAt: false,

        // If don't want updatedAt
        updatedAt: false,
    });
};