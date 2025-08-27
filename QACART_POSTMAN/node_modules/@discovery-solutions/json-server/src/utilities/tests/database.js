import { JSON_EXAMPLE } from "utilities/tests/constants";
import CRUD from "features/databases/mongo/CRUD";

// DB
import { MongoClient } from "mongodb";
import Databases from "features/databases";
import CustomDB from "features/databases/custom";

export function useDB(DB, ENTITY) {
  const { list } = new Databases(JSON_EXAMPLE);
  const setup = list.find(item => item.name === DB);

  switch (setup.type) {
    case "mongo-db":
    case "mongodb":
    case "mongoDB":
    case "mongo": {
      return new TestMongo(setup, ENTITY.name);
    }
    case "custom":
    default: {
      return new TestCustom(setup, ENTITY.name);
    }

  }
}

export class TestCustom {
  constructor(setup, entity) {
    const db = new CustomDB(setup);

    db.setEntity(entity);

    return db;
  }
}

export class TestMongo extends CRUD {
  constructor({ name, uri }, entity) {
    super();

    this.name = name;
    this.entity = entity;
    this.client = new MongoClient(uri);
  }

  async connect() {
    await this.client.connect();

    this.db = this.client.db(this.name);
    this.collection = this.db.collection(this.entity);
  }
}
