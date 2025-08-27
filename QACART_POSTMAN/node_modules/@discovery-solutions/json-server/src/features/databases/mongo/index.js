import { MongoClient } from "mongodb";
import * as Utils from "utilities/utils";
import CRUD from "./CRUD";

export default class MongoDB extends CRUD {
  constructor({ uri, name, key }) {
    super();

    this.client = new MongoClient(uri);
    this.name = name;
    this.uri = uri;
    this.key = key;
  }

  async createTextIndexes() {
    for (const entity of Utils.getJSON().entities) {
      try {
        const collection = this.db.collection(entity.name);

        await collection.createIndex({ "$**": "text" }, {
          default_language: CONSTANTS.SERVER.SETTINGS.LANGUAGE.DEFAULT
        });
      } catch (e) {
        // console.log(e);
      }
    }
  }

  async connect() {
    try {
      await this.client.connect();

      this.db = this.client.db(this.name);

      await this.createTextIndexes();

      return this;
    } catch (e) {
      console.log(e);
      return e;
    }
  }

  async setEntity(entityName) {
    await Utils.asyncTry(async () => {
      await this.db.createCollection(entityName);
    });

    this.entity = entityName;
    this.collection = this.db.collection(entityName);
  }

  async count(query = {}) {
    return this.collection.count(query);
  }

  async validateID(id) {
    return id.match(/^[0-9a-fA-F]{24}$/);
  }
}
