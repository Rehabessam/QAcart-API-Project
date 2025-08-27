export const PORT = 3501;
export const DB = "test-database";

export const POST = {
  name: "post",
  alias: "Post",
  fields: {
    title: {
      type: "string",
      required: true
    },
    body: {
      type: "string",
      required: true
    }
  },
  permission: {
    insert: false,
    update: false,
    delete: false,
    list: true,
    get: true,
  }
}

export const AUTH = {
  type: "jwt",
  fields: ["email", "password"],
  secret: "MY-SECRET-FOR-AUTH",
  permission: {
    "*": {
      insert: true,
      update: true,
      delete: true,
      list: true,
      get: true,
    }
  }
}

export const USER = {
  name: "user",
  alias: "User",
  auth: AUTH,
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
    },
  }
}

export const JSON_EXAMPLE = {
  name: "test-server",
  label: "Test Server Project",
  cors: true,
  config: {
    port: PORT,
    type: "rest",
    format: "json"
  },
  database: {
    // type: "custom",
    type: "mongo",
    uri: "mongodb+srv://dbAdmin:dbPassword@cluster0.dr81f.gcp.mongodb.net/test?retryWrites=true&w=majority",
    key: DB,
    name: DB,
  },
  entities: [USER, POST]
};
