import EventListener, { Events } from "utilities/event-listener";
import { getJSON } from "utilities/utils";
import Requests from "features/requests";
import URL from "features/entity/url";

const eventListener = new EventListener(Events.REQUEST.BEFORE.PROCESS);

// Access controller for routes
eventListener.set(async function authentication(req, res) {
  const { PERMISSIONS, REQUESTS, PERMISSIONS_BY_METHODS } = CONSTANTS.SERVER.AUTH;

  const permissionByURL = {
    oldest: PERMISSIONS.LIST,
    latest: PERMISSIONS.LIST,
    update: PERMISSIONS.UPDATE,
    delete: PERMISSIONS.DELETE,
    insert: PERMISSIONS.INSERT,
    list: PERMISSIONS.LIST,
    get: PERMISSIONS.GET,
  }

  // Identify if API need authentication
  const doesNeedAuthentication = getJSON().entities.filter(entity => {
    return typeof entity.auth === "object";
  }).length > 0;

  if (doesNeedAuthentication === false)
    return false;

  // Identify public access entity routes
  const validPermissions = Object.keys(req?.entity?.permission || {})?.filter(key => req.entity?.permission[key] === true);
  const isPublicRequest = !!validPermissions?.find(key => PERMISSIONS_BY_METHODS[req.method].includes(key));

  if (isPublicRequest || Requests.inWhitelist(req))
    return false;

  for (const key of Object.keys(URL)) {
    if ( URL[key](req) ) {
      const permissions = req.entity?.auth?.permission;

      if (permissions) {
        const permission = permissionByURL[key] || PERMISSIONS.LIST;
        const authPermission = permissions[req.entity.name] || permissions["*"];

        const isAuthenticated = !!req.auth;
        const hasPermission = !!authPermission[permission];

        if (hasPermission && isAuthenticated)
          return false;
      }
    }
  }

  return res.code(401);
});
