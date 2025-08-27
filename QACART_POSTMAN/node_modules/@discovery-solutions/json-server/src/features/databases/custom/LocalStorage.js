import path from "path";
import fs from "fs";

export default class LocalStorage {
  constructor(database) {
    this.filePath = path.join(process.cwd(), "db.json");
    this.name = database;
    this.db = this.readFile();
  }

  setEntity(entity) {
    this.entity = entity;
  }

  writeFile = data => fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2));
  readFile = () => {
    const fileExists = fs.existsSync(this.filePath);

    if (fileExists)
      return JSON.parse( fs.readFileSync(this.filePath, "utf8") );

    fs.writeFileSync(this.filePath, "{}");
    return {};
  }

  getAll = () => {
    this.db = this.readFile();
    return this.db[this.name][this.entity];
  }

  setAll = data => {
    this.db = data;
    this.writeFile(data);
  }

  add = (record) => {
    if ( Array.isArray(this.db[this.name][this.entity]) === false )
      this.db[this.name][this.entity] = [];

    this.db[this.name][this.entity].push(record);

    this.writeFile(this.db);
  }

  set = (records) => {
    this.db[this.name][this.entity] = records;

    this.writeFile(this.db);
  }

  find = (query = {}) => {
    const data = this.getAll();
    const keys = Object.keys(query);
    const records = [];

    if (keys.length === 0)
      return data;

    for (const row of data) {
      const matchs = [];

      keys.forEach(key => {
        if (row[key] === query[key])
          matchs.push(true);
      });

      if (matchs.length === keys.length)
        records.push(row);
    }

    return records;
  }

  indexOf = (query = {}) => {
    const keys = Object.keys(query);
    let i = 0;

    for (const row of this.getAll()) {
      const matchs = [];

      keys.forEach(key => {
        if (row[key] === query[key])
          matchs.push(true);
      });

      if (matchs.length === keys.length)
        return i;

      i++;
    }

    return -1;
  }
}
