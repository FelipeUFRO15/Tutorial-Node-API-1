import 'dotenv/config'; //no mover
import express from 'express';
import cors from 'cors';
import { ApolloServer, gql } from 'apollo-server-express';
import uuidv4 from 'uuid/v4';

const app = express();
app.use(cors());

const schema = gql`
  type Query {
    users: [User!]
    user(id: ID!): User
    me: User

    messages: [Message!]!
    message(id: ID!): Message!
  }

  type Mutation {
    createMessage(text: String!): Message!
    updateMessage(id: ID!, text: String!): Message!
    deleteMessage(id: ID!): Boolean!
  }

  type User {
    id: ID!
    username: String!
    messages: [Message!]
  }

  type Message {
    id: ID!
    text: String!
    user: User!
  }
`;

let users = {
  1: {
    id: '1',
    username: 'Axadian',
    messageIds: [1],
  },
  2: {
    id: '2',
    username: 'FelipeUFRO15',
    messageIds: [2],
  },
};

let messages = {
  1: {
    id: '1',
    text: 'Im a spinene',
    userId: '1',
  },
  2: {
    id: '2',
    text: 'In the first age, in the first battle.',
    userId: '2',
  },
}

const resolvers = {
  Query: {
    users: () => {
      return Object.values(users);
    },
    user: (parent, { id }) => {
      return users[id];
    },
    me: (parent, args, { me }) => {
      return me;
    },

    messages: () => {
      return Object.values(messages);
    },
    message: (parent, { id }) => {
      return messages[id];
    },
  },

  Mutation: {
    createMessage: (parent, { text }, { me }) => {
      const id = uuidv4();
      const message = {
        id,
        text,
        userId: me.id,
      };

      messages[id] = message;
      users[me.id].messageIds.push(id);

      return message;
    },
    updateMessage: (parent, { id, text }) => {
      const updatedMessage = messages[id];

      if (!updatedMessage) {
        return false;
      }

      updatedMessage.text = text;
      messages[id] = updatedMessage;

      return messages[id];
    },
    deleteMessage: (parent, { id }) => {
      const { [id]: message, ...otherMessages } = messages;

      if (!message) {
        return false;
      }

      messages = otherMessages;

      return true;
    },
  },

  User: {
    messages: user => {
      return Object.values(messages).filter(
        message => message.userId === user.id,
      );
    },
  },

  Message: {
    user: message => {
      return users[message.userId];
    },
  },
};

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: {
    me: users[1],
  },
});

server.applyMiddleware({ app, path: '/graphql'});

app.listen({ port: 8000}, () => {
  console.log('Apollo server on http://localhost:8000/graphql');
});