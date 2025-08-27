import axios from "utilities/tests/axios";

test("GET /", async () => {
  const { data } = await axios.get("/");

  expect(data?.status).toBe(true);
  expect(data?.code).toBe(200);
  expect(typeof data?.message).toBe("string");
});
