module.exports = (sequelize, DataTypes) => {
    const Contact = sequelize.define('Contact', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {
        timestamps: true,
    });

    return Contact;
};