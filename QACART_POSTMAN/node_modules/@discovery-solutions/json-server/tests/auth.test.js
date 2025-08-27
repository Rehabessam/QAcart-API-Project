import { useID, configureEnviroment } from "utilities/tests/utils";
import { DB, USER } from "utilities/tests/constants";
import { useDB } from "utilities/tests/database";
import Databases from "features/databases";
import axios from "utilities/tests/axios";

configureEnviroment();

// Setting up user to authenticate
let id, storage = useDB(DB, USER);
let user = {
  name: "My User Name",
  email: "user-email@email.com",
  password: "my-password-1",
}

describe("Entity Routes With Valid Authentication", () => {
  beforeAll(async () => {
    await storage.connect();

    user = await storage.insert(user);
  });

  test("POST /system/auth", async () => {
    const { data, headers } = await axios.post("/system/auth", user);

    expect(typeof headers["x-auth-token"]).toBe("string");
    expect(headers["x-auth-token"]?.length).toBeTruthy();

    expect(data?.status).toBe(true);
    expect(data?.code).toBe(200);
    expect(typeof data?.message).toBe("string");
  });

  afterAll(async () => {
    await storage.deleteByID( useID(user) );

    Databases.closeAll();
  });
});
