import * as Utils from "utilities/utils";
import Databases from "features/databases";
import { validateByEntityModel, getID } from "./utils";
import URL from "./URL";

class EntityHandler {
  constructor(request, database) {
    this.request = request;
    this.response = null;
    this.entity = {};
    this.database = Databases.get(database);
  }

  async run() {
    const { method, url } = this.request;
    const isValidURLCode = await this.validateURL();
    const isValidMethod = Object.values(CONSTANTS.SERVER.METHODS).includes(method);

    if ( isValidMethod === false )
      return this.next(404);

    if ( isValidURLCode !== 200 )
      return this.next(isValidURLCode);

    return await this.action();
  }

  next = (code) => ({
    response: this.response,
    code,
  })

  validateURL = async () => {
    try {
      const json = Utils.getJSON();
      const [ urlEntity ] = this.request.url.splitted;

      for (const entity of json.entities) {
        const hasEntityName = (urlEntity === entity.name);

        if (hasEntityName) {
          this.entity = entity;
          await this.database.setEntity( entity.name );
          return 200;
        }
      }

      return 404;
    } catch (e) {
      logger(e);
      return 500;
    }
  }

  action = async () => {
    // Apllying validations
    if ( URL.oldest(this.request) )
      return await this.oldest();

    if ( URL.latest(this.request) )
      return await this.latest();

    if ( URL.update(this.request) )
      return await this.update();

    if ( URL.delete(this.request) )
      return await this.delete();

    if ( URL.insert(this.request) )
      return await this.insert();

    if ( URL.list(this.request) )
      return await this.list();

    if ( URL.get(this.request) )
      return await this.get();

    // If the request doesn't match any of the criteria
    return this.next(404);
  }

  // CRUD Methods For Controller
  list = async () => {
    try {
      // Searching for records
      const [ records, count ] = await Promise.all([
        this.database.list(),
        this.database.count(),
      ]);

      // Returning response
      this.response = {
        records: Utils.secureEntity(records, this.request.entity),
        count: count,
      }

      return this.next(200);
    } catch (e) {
      logger(e);
      return this.next(500);
    }
  }

  get = async () => {
    try {
      // Extracting data from request
      const entityID = this.request.url.splitted[1] + "";

      // Validating ID
      if ( this.database.validateID(entityID) === false )
        return this.next(404);

      // Searching for records
      const entity = await this.database.findByID(entityID);

      if (entity === false)
        return this.next(204);

      // Returning response
      this.response = {
        [this.entity.name]: Utils.secureEntity(entity, this.request.entity),
      }

      return this.next(200);
    } catch (e) {
      logger(e);
      return this.next(500);
    }
  }

  insert = async () => {
    try {
      // Extracting data from request
      const body = this.request.body;
      const data = Array.isArray(body) === false ? [ body ] : body;
      const responseData = [];

      // Validating object with entity model
      for (const dataItem of data) {
        const isValid = validateByEntityModel(dataItem, this.entity);

        if (isValid === false) {
          responseData.push(400);
        } else {
          const entity = await this.database.insert(dataItem);

          responseData.push(entity === false ? 500 : entity);
        }
      }

      // Returning response
      if ( responseData.includes(400) )
        return this.next(400);

      if ( responseData.includes(400) )
        return this.next(500);

      const record = data.length === 1 ? responseData[0] : responseData;

      this.response = {
        [this.entity.name]: Utils.secureEntity(record, this.request.entity),
      }

      return this.next(200);
    } catch (e) {
      logger(e);
      return this.next(500);
    }
  }

  delete = async () => {
    try {
      // Extracting data from request
      const entityID = getID(this.request.url);

      // Validating ID
      if (this.database.validateID(entityID) === false)
        return this.next(400);

      // Deleting record
      const entity = await this.database.deleteByID(entityID);

      // If more than 1 record is deleted, return 200
      if (entity?.deletedCount > 0)
        return this.next(200);

      // If no record is deleted, return custom message
      this.response = {
        message: "0 records deleted"
      }

      return this.next(200);
    } catch (e) {
      logger(e);
      return this.next(500);
    }
  }

  update = async () => {
    try {
      // Extracting data from request
      const entityID = getID(this.request.url);
      const body = this.request.body;

      // Validating ID
      if (this.database.validateID(entityID) === false)
        return this.next(400);

      // Cleaning object to allow only keys from entity fields
      const validKeys = Object.keys(this.entity.fields);
      const data = {};

      for (const key of validKeys)
        if (body[key])
          data[key] = body[key];

      // If the object is empty, return 400
      if ( Object.keys(data).length < 1 )
        return this.next(400);

      // Updating record
      const updatedStatus = await this.database.updateByID(entityID, data);

      // If no record is updated, return custom message
      if (updatedStatus?.modifiedCount < 1) {
        this.response = {
          message: "No records updated"
        }

        return this.next(500);
      }

      // Searching for the updated values on that entity
      const entity = await this.database.findByID(entityID);

      if (entity !== false) {
        this.response = {
          [this.entity.name]: Utils.secureEntity(entity, this.request.entity),
        }
      }

      // Returning response
      return this.next(200);
    } catch (e) {
      logger(e);
      return this.next(500);
    }
  }

  oldest = async () => {
    try {
      // Searching for records
      const records = await this.database.getOldest();

      this.response = {
        records: Utils.secureEntity(records, this.request.entity),
      }

      // Returning response
      return this.next(200);
    } catch (e) {
      logger(e);
      return this.next(500);
    }
  }

  latest = async () => {
    try {
      // Searching for records
      const records = await this.database.getLatest();

      this.response = {
        records: Utils.secureEntity(records, this.request.entity),
      }

      // Returning response
      return this.next(200);
    } catch (e) {
      logger(e);
      return this.next(500);
    }
  }
}

export default class Entity {
  static handle(request, database) {
    const entity = new EntityHandler(request, database);

    return entity.run();
  }
}
