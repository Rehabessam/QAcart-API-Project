import EventListener, { Events } from "utilities/event-listener";
import AuthTokenHandler from "../token";
import { WHITELIST } from "../constants";
import { getJSON } from "utilities/utils";
import Requests from "features/requests";

const eventListener = new EventListener(Events.REQUEST.BEFORE.PROCESS);

// Identify user from token
eventListener.set(async function validation(req, res) {
  const { entities } = getJSON();

  const splitted = req.url.split("/");
  const [ base = "", params = "" ] = req.url.split("?");

  req.url = {
    value: req.url,
    base: base,
    splitted: splitted.filter(item => item.length > 0),
    params: params.split("&").reduce((obj, item) => {
      const [ key, value ] = item.split("=");

      obj[key] = value;

      return obj;
    }, {})
  }

  req.entity = entities.find(e => e.name === req.url.splitted[0]) || false;

  if (Requests.inWhitelist(req))
    return false;

  const authToken = req.headers["x-auth-token"] || req.headers["authorization"];

  if (typeof authToken === "undefined")
    return res.code(401);

  const authTokenHandler = new AuthTokenHandler(req);
  const [ auth, type ] = await authTokenHandler.validate(authToken);

  req.auth = auth;
  req.entity = entities.find(e => e.name === type) || false;
});
