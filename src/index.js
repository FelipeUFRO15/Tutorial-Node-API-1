import 'dotenv/config'; //no mover
import express from 'express';
import cors from 'cors';
import { ApolloServer } from 'apollo-server-express';

import schema from './schema';
import resolvers from './resolvers';
import models, { sequelize } from './models';

const app = express();
app.use(cors());

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  formatError: error => {
    const message = error.message
      .replace('SequelizeValidationError: ', '')
      .replace('Validation error: ', '');
    
    return {
      ...error,
      message,
    };
  },
  context: async () => ({
    models,
    me: await models.User.findByLogin('Axadian'),
    secret: process.env.SECRET,
  }),
});

server.applyMiddleware({ app, path: '/graphql'});

const eraseDatabaseOnSync = true;

sequelize.sync({ force: eraseDatabaseOnSync }).then(async () => {
  if (eraseDatabaseOnSync) {
    createUsersWithMessages();
  }

  app.listen({ port: 8000}, () => {
    console.log('Apollo server on http://localhost:8000/graphql');
  });
});

const createUsersWithMessages = async () => {
  await models.User.create(
    {
      username: 'Axadian',
      email: 'felipe@gmail.com',
      password: 'axadian',
      messages: [
        {
          text: 'Primer commit de la aplicación',
        },
      ],
    },
    {
      include: [models.Message],
    },
  );

  await models.User.create(
    {
      username: 'Marcostephd',
      email: 'marcos@marcostep.hd',
      password: 'marcostephd',
      messages: [
        {
          text: 'Segundo commit de la aplicación',
        },
        {
          text: 'Arreglando cagada de commit anterior',
        },
      ],
    },
    {
      include: [models.Message],
    },
  );
};
