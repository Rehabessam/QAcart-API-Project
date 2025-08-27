import { useID, configureEnviroment } from "utilities/tests/utils";
import { DB, POST } from "utilities/tests/constants";
import { useDB } from "utilities/tests/database";
import Databases from "features/databases";
import axios from "utilities/tests/axios";

configureEnviroment();

// Setting up post for tests
let id, storage = useDB(DB, POST);
let post = {
  title: "My Post Title",
  body: "My Body Post"
}

describe("Entity Routes Without Authentication", () => {
  const validateResponse = ({ data, ...rest }, testFor) => {
    switch (testFor) {
      case "success": {
        expect(data?.status).toBe(true);
        expect(data?.code).toBe(200);
        expect(typeof data.message).toBe("string");
        expect(typeof (data.post || data.records)).toBe("object");
        expect(Object.keys(data.post || data.records).length >= 0).toBeTruthy();
        break;
      }
      case "error":
      default: {
        expect(data?.status).toBe(false);
        expect(data?.code).toBe(401);
        expect(typeof data.message).toBe("string");
      }
    }
  }

  beforeAll(async () => {
    await storage.connect();

    post = await storage.insert(post);

    id = useID(post);
  });

  test("POST /post", async () => {
    const res = await axios.post("/post", post);

    validateResponse(res, "error");

  });

  test("PATCH /post/{id}", async () => {
    const res = await axios.patch("/post/"+ id, {
      title: "Post title updated"
    });

    validateResponse(res, "error");
  });

  test("GET /post/{id}", async () => {
    const res = await axios.get("/post/"+ id);

    validateResponse(res, "success");
  });

  test("GET /post", async () => {
    const res = await axios.get("/post");

    validateResponse(res, "success");
  });

  test("GET /post/oldest", async () => {
    const res = await axios.get("/post");

    validateResponse(res, "success");
  });

  test("GET /post/latest", async () => {
    const res = await axios.get("/post");

    validateResponse(res, "success");
  });

  test("DELETE /post/{id}", async () => {
    const res = await axios.delete("/post/"+ id);

    validateResponse(res, "error");
  });

  afterAll(async () => {
    await storage.deleteByID( useID(post) );

    Databases.closeAll();
  });
});
