import uuidv4 from 'uuid/v4';

const userResolvers = {
  Query: {
    users: async (parent, args, { models }) => {
      return await models.User.findAll();
    },
    user: async (parent, { id }, { models }) => {
      return await models.User.findByPk(id);
    },
    me: (parent, args, { me }) => {
      return await models.User.findByPk(me.id);
    },
  },

  User: {
    messages: async (user, args, { models }) => {
      return await models.Message.findAll({
        where: {
          userId: user.id,
        },
      });
    },
  },
};

export default userResolvers;
