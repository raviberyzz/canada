/*
  clientlib genrator intitialze module
*/
var clientlib = require("aem-clientlib-generator");
var path = require("path");
var fs = require("fs");
var DEFAULT_FILE = "./clientlib.config.js";

var configPath = path.resolve(process.cwd(), DEFAULT_FILE);
var libs = [];

if (!fs.existsSync(configPath)) {
  console.error("Could not find config file: " + configPath);
  process.exit(1);
}

var clientLibConf = require(configPath);
libs = clientLibConf.libs;
console.log('libs===>>>', libs);
delete clientLibConf.libs;

clientlib(libs, clientLibConf, function () {
  console.log("clientlib generator has finished for "+libs.length+" modules");
});