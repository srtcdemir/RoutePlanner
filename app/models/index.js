const dbConfig = require("../config/db.config.js");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.stations = require("./stations.js")(mongoose);
db.cities = require("./cities")(mongoose);
db.states = require("./states.js")(mongoose);

module.exports = db;