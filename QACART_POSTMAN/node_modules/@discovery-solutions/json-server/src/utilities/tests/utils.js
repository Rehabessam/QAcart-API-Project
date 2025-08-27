import { JSON_EXAMPLE } from "utilities/tests/constants";

export { useID } from "utilities/utils";

export function configureEnviroment() {
  jest.setTimeout(1000 * 10);
  global["json-server"] = JSON_EXAMPLE;
}
