import { useID, getJSON, secureEntity } from "utilities/utils";
import Databases from "features/databases";
import Requests from "features/requests";
import jwt from "jsonwebtoken";

import AuthTokenHandler from "../token";
import { AUTH } from "../constants";

const [ method, path ] = AUTH.ROUTES.LOGIN;
const requests = new Requests();

requests.use(method, path, async (req, res) => {
  const database = Databases.get(req.server.database);
  let secret = CONSTANTS.SERVER.SETTINGS.DATABASE.DEFAULT;

  try {
    let entityData = null;
    let entity = null;

    for (const entityItem of getJSON().entities) {
      if (typeof entityItem.auth === "object") {
        await database.setEntity(entityItem.name);

        const search = Object.keys(req.body).reduce((obj, key) => {
          if ( entityItem?.auth?.fields?.includes(key) )
            obj[key] = req.body[key];

          return obj;
        }, {});

        const record = await database.find(search);

        if (record && Object.keys(record).length > 0) {
          entityData = record;
          entity = entityItem;
        }
      }
    }

    // Could not identify credentials
    if (!entityData || !entity)
      return res.code(401);

    if (entity?.auth?.secret)
      secret = entity.auth.secret;

    // Generating token
    const authTokenHandler = new AuthTokenHandler(req);

    const id = useID(entityData);
    const access = authTokenHandler.generate();

    // Signing token
    const authToken = (entity?.auth?.type !== "jwt") ? access : jwt.sign({ access, id }, secret);

    // Recording access token on DB
    await authTokenHandler.register(id, entity.name, authToken);

    // Returning token
    res.setHeader("x-auth-token", authToken);

    // Returning entity data

    return res.json({
      [entity.name]: secureEntity(entityData, entity)
    });
  } catch (e) {
    logger(e);
    return res.code(500);
  }

  return false;
});
