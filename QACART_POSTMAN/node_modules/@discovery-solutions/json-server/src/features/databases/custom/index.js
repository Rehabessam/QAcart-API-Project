import LocalStorage from "./LocalStorage";
import CRUD from "./CRUD";
import fs from "fs";

export default class CustomDB extends CRUD {
  constructor({ name, key }) {
    super();

    this.storage = new LocalStorage(name);

    if (!this.storage.db[name])
      this.storage.db[name] = {};

    this.name = name;
    this.key = key;

    this.storage.setAll({ ...this.storage.db });
  }

  connect = async () => {
    return this;
  }

  setEntity = async (entity) => {
    this.entity = entity;

    await this.storage.setEntity(entity);

    if (typeof this.storage.db[this.name][this.entity] === "undefined")
      this.storage.set([]);
  }

  count = async (query = {}) => {
    return this.storage.db[this.name][this.entity]?.length || 0;
  }

  validateID = async (id) => {
    if (typeof id !== "string")
      return false;
      
    return id.match(/^[0-9a-fA-F]{24}$/);
  }
}
