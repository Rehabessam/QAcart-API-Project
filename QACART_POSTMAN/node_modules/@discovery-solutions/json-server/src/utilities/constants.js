import { METHODS } from "features/entity/constants";
import { Events } from "utilities/event-listener";
import { AUTH } from "features/auth/constants";
import { DOCS } from "features/api-docs/constants";

const CONSTANTS = {
  SERVER: {
    METHODS: METHODS,
    EVENTS: Events,
    AUTH: AUTH,
    DOCS: DOCS,
    SECRET: "DEFAUL-SECRET-JSON-SERVER",
    TYPES: {
      REST: "rest",
      SOCKET: "socket",
    },
    FORMATS: {
      JSON: "json",
      CSV: "csv",
    },
    SETTINGS: {
      DATABASE: {
        DEFAULT: "custom-db",
        AUTH: "json-server-auth",
      },
      REQUEST: {
        LIMIT: 10,
      },
      LANGUAGE: {
        DEFAULT: "pt",
      }
    }
  }
};

export default CONSTANTS;

global.CONSTANTS = CONSTANTS;
