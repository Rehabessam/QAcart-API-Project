import "features/auth";
import "features/api-docs";
import "features/requests/routes";

import * as Utils from "utilities/utils";
import Rest from "./rest/";

export default class ServerTypes {
  constructor({ config }) {
    this.servers = [];

    for (const configItem of Utils.getArray(config)) {
      if (configItem.type === CONSTANTS.SERVER.TYPES.REST) {
        const server = new Rest( this.getConfigData(configItem) );

        this.servers.push( server );
      }
    }

    return this.servers;
  }

  getConfigData(item) {
    const [ databaseSetup ] = Utils.getArray( Utils.getJSON().database );

    let config = {
      ...item
    };

    if (!config.database)
      config.database = databaseSetup?.key || CONSTANTS.SERVER.SETTINGS.DATABASE.DEFAULT;

    return config;
  }
}
