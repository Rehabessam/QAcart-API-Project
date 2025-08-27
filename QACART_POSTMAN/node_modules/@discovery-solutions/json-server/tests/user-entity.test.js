import { useID, configureEnviroment } from "utilities/tests/utils";
import { DB, USER } from "utilities/tests/constants";
import { useDB } from "utilities/tests/database";
import Databases from "features/databases";
import axios from "utilities/tests/axios";

configureEnviroment();

let id, storage = useDB(DB, USER);
const users = [];
const user = {
  name: "My User Name",
  email: "user-email@email.com",
  password: Date.now().toString(),
}

describe("Entity Routes With Valid Authentication", () => {
  const validateResponse = ({ data }, testFor) => {
    expect(data?.status).toBe(true);
    expect(data?.code).toBe(200);
    expect(typeof data.message).toBe("string");

    if (testFor !== "delete") {
      expect(typeof (data.user || data.records)).toBe("object");
      expect(Object.keys(data.user || data.records).length).toBeTruthy();
    }
  };

  beforeAll(async () => {
    await storage.connect();

    users.push( useID( await storage.insert(user) ) );
  });

  beforeEach(async () => {
    try {
      const { data, headers } = await axios.post("/system/auth", user);

      if (data.status)
        axios.defaults.headers.common["x-auth-token"] = headers["x-auth-token"];
    } catch (e) {
      console.log(e);
    }
  });

  test("POST /user", async () => {
    const res = await axios.post("/user", {
      password: Date.now().toString(),
      email: user.email,
      name: user.name,
    });

    validateResponse(res);

    id = useID(res?.data?.user);
  });

  test("PATCH /user/{id}", async () => {
    const res = await axios.patch("/user/" + id, {
      name: "User name updated"
    });

    validateResponse(res);
  });

  test("GET /user/{id}", async () => {
    const res = await axios.get("/user/" + id);

    validateResponse(res);
  });

  test("GET /user", async () => {
    const res = await axios.get("/user");

    validateResponse(res);
  });

  test("GET /user/oldest", async () => {
    const res = await axios.get("/user");

    validateResponse(res);
  });

  test("GET /user/latest", async () => {
    const res = await axios.get("/user");

    validateResponse(res);
  });

  test("DELETE /user/{id}", async () => {
    const res = await axios.delete("/user/" + id);

    validateResponse(res, "delete");
  });

  afterAll(async () => {
    for (const userID of users)
      await storage.deleteByID(userID.toString());

    Databases.closeAll();
  });
});
