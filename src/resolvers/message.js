import uuidv4 from 'uuid/v4';

const messageResolvers = {
  Query: {
    messages: async (parent, args, { models }) => {
      return await models.Message.findAll();
    },
    message: async (parent, { id }, { models }) => {
      return await models.Message.findByPk(id);
    },
  },

  Mutation: {
    createMessage: async (parent, { text }, { me, models }) => {
      try {
        return await models.Message.create({
          text,
          userId: me.id,
        });
      } catch (error) {
        throw new Error(error);
      }
    },
    updateMessage: async (parent, { id, text }, { models }) => {
      return await models.Message.update({
          text,
        }, { where: { id } 
      });
    },
    deleteMessage: async (parent, { id }, { models }) => {
      return await models.Message.destroy({ where: { id } });
    },
  },

  Message: {
    user: async (message, args, { models }) => {
      return await models.User.findByPk(message.userId);
    },
  },
};

export default messageResolvers;
