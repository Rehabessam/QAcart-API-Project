import http from "http";
import Handler from "./handler";
import * as Utils from "utilities/utils";

export default class Rest {
  constructor(props) {
    const { port, type, format } = props;

    this.port = port;
    this.host = Utils.getIP();

    this.app = http.createServer( new Handler(props) );

    this.app.listen(this.port, this.host, () => {
      logger(`Server running on http://${this.host}:${this.port}`);
    });

    return this;
  }
}
