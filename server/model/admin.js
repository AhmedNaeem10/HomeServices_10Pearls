/**
 * @swagger
 * components:
 *   schemas:
 *     ADMINS:
 *       type: object
 *       required:
 *         - id
 *         - USERNAME
 *         - PASSWORD
 *       properties:
 *         id:
 *           type: int
 *           description: The auto-generated id of admin
 *         USERNAME:
 *           type: string
 *           description: The admin username
 *         PASSWORD:
 *           type: string
 *           description: The admin password
 *       example:
 *         id: 6
 *         title: admin6
 *         author: 9026040An!
 * 
 * 
 */

module.exports = (sequelize, Sequelize) => {
    return ADMIN = sequelize.define("ADMINS", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true      
        },
        USERNAME: {
            type: Sequelize.STRING(15),
            allowNull: false,
            unique: true
        },
        PASSWORD: {
            type: Sequelize.STRING(15),
            allowNull: false
        }, 
    }, {
        timestamps: false,

        // If don't want createdAt
        createdAt: false,

        // If don't want updatedAt
        updatedAt: false,
    });
};