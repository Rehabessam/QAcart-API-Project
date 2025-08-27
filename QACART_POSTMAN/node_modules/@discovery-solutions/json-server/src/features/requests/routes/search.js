import Requests from "features/requests";
import Databases from "features/databases";
import { ROUTES } from "../constants";

const [ method, path ] = ROUTES.SEARCH;
const requests = new Requests();

requests.use(method, path, { public: false }, async (req, res) => {
  if (Object.keys(req.url.params).length === 0)
    return res.status(422);

  const { query, search, s, q } = req.url.params;
  const querySearch = query || search || s || q;

  const database = Databases.get(req.server.database);
  await database.setEntity(req.entity.name);

  const records = await database.search(querySearch);

  return res.json({ records });
});
