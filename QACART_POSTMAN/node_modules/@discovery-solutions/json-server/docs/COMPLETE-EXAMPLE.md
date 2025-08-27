# Complete Example

```js
import Server from "@discovery-solutions/json-server";

const server = new Server({
  name: "my-server",
  config: [{
    port: 3501,
    type: "rest",
    format: "json",
    database: "my-db-1",
    request: {
      limit: 10,
    },
  }, {
    port: 3500,
    type: "socket",
    format: "csv",
    database: "my-db-2",
    request: {
      limit: 1000,
    },
  }],
  database: [{
    type: "custom",
    key: "my-db-1",
    name: "my-custom-db"
  }, {
    type: "mongo",
    key: "my-db-2",
    name: "my-mongo-db",
    uri: "mongodb+srv://...",
  }],
  entities: [{
    name: "user",
    alias: "User",
    fields: {
      name: {
        type: "string",
        required: true
      },
      email: {
        type: "string",
        required: true
      },
      password: {
        type: "string",
        required: true,
        secure: true,
      }
    },
    auth: {
      type: "jwt",
      fields: ["login", "password"],
      permission: {
        "*": {
          insert: false,
          update: false,
          delete: false,
          list: true,
          get: true,
        },
        "post": {
          insert: true,
          update: true,
          delete: true,
          list: true,
          get: true,
        }
      }
    }
  }, {
    name: "post",
    alias: "Post",
    fields: {
      title: {
        type: "string",
        required: true
      },
      subtitle: {
        type: "string",
        required: true
      },
      content: {
        type: "string",
        required: true
      },
      tags: "object",
    }
  }]
});

server.setup({
  language: "pt",
  database: {
    default: "my-project-default-name",
  },
  request: {
    limit: 5
  }
});

server.run();

```
