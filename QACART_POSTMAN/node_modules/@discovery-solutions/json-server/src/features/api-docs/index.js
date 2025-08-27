import fs from "fs";
import path from "path";
import * as Utils from "utilities/utils";
import Requests from "features/requests";
import { DOCS, MIME_TYPES } from "./constants";

const requests = new Requests();
const defaultFile = "index.html";

requests.use(DOCS.ROUTES.DOCS, async (req, res) => {
  const ext = path.parse(req.url.base)?.ext;

  res.setHeader("Content-Type", MIME_TYPES[ext || ".html"]);

  if (req.url.base.slice(-1) !== "/" && !ext) {
    const redirectURL = Utils.createURL(req, req.url.base)

    res.setHeader("Location", redirectURL);
    return res.code(301);
  }

  const sanitized = path.normalize(req.url.base).replace("/system/docs", "");
  const filepath = ["", "/"].includes(sanitized) ? defaultFile : sanitized;

  res.payload = fs.readFileSync( path.join(__dirname, "files", filepath) );
  return true;
});

function getTypesFromFields(fields, shouldSecure = true) {
  return Object.keys(fields).reduce((obj, key) => {
    if (fields[key].secure && shouldSecure)
      return obj;

    return {
      ...obj,
      [key]: fields[key].type || fields[key]
    }
  }, {})
}

requests.use(DOCS.ROUTES.API, async (req, res) => {
  const json = Utils.getJSON();

  const auth = [];

  const entities = json.entities.map(entity => {
    if (entity.auth) {
      const authFields = entity.auth.fields.reduce((obj, field) => ({
        ...obj,
        [field]: entity.fields[field]
      }), {});

      auth.push({
        entity: entity.name,
        alias: entity.alias || false,
        type: entity.auth.type,
        response: getTypesFromFields(entity.fields),
        fields: getTypesFromFields(authFields, false),
      });
    }

    return {
      name: entity.name,
      alias: entity.alias || false,
      fields: entity.fields
    }
  });

  res.json({
    docs: {
      name: json.name,
      label: json.label,
      host: Utils.createURL(req),
      entities,
      auth,
    }
  });

  return true;
});
