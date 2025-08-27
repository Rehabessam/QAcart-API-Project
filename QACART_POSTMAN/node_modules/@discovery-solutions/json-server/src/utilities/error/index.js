import { CODES } from "./constants";

export default class Error {
  static get(code) {
    return {
      status: [200, 201].includes(code),
      ...CODES[code],
    }
  }
}
