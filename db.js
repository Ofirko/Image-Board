var spicedPg = require("spiced-pg");
const config = require("./config");
let path =
    "postgres:" +
    config.user +
    ":" +
    config.pass +
    "@localhost:5432/wintergreen-imageboard";
var db = spicedPg(process.env.DATABASE_URL || path);

module.exports.getAllImages = function getAllImages() {
    return db.query("SELECT * FROM images");
};
