#!/usr/bin/env node
const Server = require("../dist/index.cjs.js");
const path = require("path");
const fs = require("fs");

let json;

try {
  json = JSON.parse( fs.readFileSync("server.json") );
} catch (e) {
  return console.error("No server.json file");
}

try {
  const server = new Server(json);

  server.run();
} catch (e) {
  return console.error(e);
}
