import Requests from "features/requests";
import { ROUTES } from "../constants";

const requests = new Requests();

const callback = async (req, res) => {
  return res.json({
    message: "API Running",
    documentation: CONSTANTS.SERVER.DOCS.ROUTES.DOCS.replace("*", "")
  });
}

for (const [ method, path ] of [ROUTES.HOME, ROUTES.SYSTEM])
  requests.use(method, path, callback);
