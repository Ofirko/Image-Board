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

module.exports.uploadImage = function uploadImage(
    url,
    username,
    title,
    description
) {
    return db.query(
        "INSERT INTO images (url, username, title, description) VALUES($1, $2, $3, $4) RETURNING *",
        [url, username, title, description]
    );
};

module.exports.fetchImage = function fetchImage(id) {
    return db.query("SELECT * FROM images WHERE id = $1", [id]);
};

module.exports.addComment = function addComment(username, comment, picId) {
    return db.query(
        "INSERT INTO comments (username, comment, picId) VALUES($1, $2, $3) RETURNING *",
        [username, comment, picId]
    );
};

module.exports.fetchComments = function fetchComments(id) {
    return db.query("SELECT * FROM comments WHERE picId = $1", [id]);
};
// SELECT * FROM images WHERE id < $1 ORDER BY id DESC LIMIT 20 ;
