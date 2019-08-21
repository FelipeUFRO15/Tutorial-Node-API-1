const message = (sequelize, DataTypes) => {
    const Message = sequelize.define('message', {
        text: {
            type: DataTypes.STRING,
        },
    });

    Message.associate = models => {
        Message.belongsTo(Models.User);
    };

    return Message;
};

export default message;
