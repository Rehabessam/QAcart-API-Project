import CustomDB from "./custom";
import MongoDB from "./mongo";
import * as Utils from "utilities/utils";

let databases = {};

export default class Databases {
  constructor(json) {
    this.list = Utils.getArray(json.database);

    this.databases = databases;

    if (this.list.length === 0) {
      this.list.push({
        name: CONSTANTS.SERVER.SETTINGS.DATABASE.DEFAULT,
        key: CONSTANTS.SERVER.SETTINGS.DATABASE.DEFAULT,
        type: "custom"
      });
    }

    this.setup();
  }

  async setup() {
    for (const item of this.list) {
      try {
        const DBClass = this.getClassByType(item.type);
        const db = new DBClass(item);

        await db.connect();

        this.databases[item.key] = db;
      } catch (e) {
        logger(e);
        this.databases[item.key] = e;
      }
    }

    if (Object.keys(this.databases).length === 0)
      logger("No databases connected");
  }

  getClassByType(type) {
    switch (type) {
      case "mongo-db":
      case "mongodb":
      case "mongoDB":
      case "mongo": {
        return MongoDB;
      }
      default:
        return CustomDB;
    }
  }

  getDB(key = CONSTANTS.SERVER.SETTINGS.DATABASE.DEFAULT) {
    return this.databases[key];
  }

  static get(key = CONSTANTS.SERVER.SETTINGS.DATABASE.DEFAULT) {
    return databases[key];
  }

  static closeAll(callback) {
    const closed = [];

    for (const key in databases) {
      if (typeof databases[key]?.client?.close === "function") {
        databases[key].client.close();
        closed.push(key);
      }
    }

    return closed;
  }
}
