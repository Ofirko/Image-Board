var spicedPg = require("spiced-pg");
const config = require("./config");
let path =
    "postgres:" +
    config.user +
    ":" +
    config.pass +
    "@localhost:5432/wintergreen-imageboard";
var db = spicedPg(process.env.DATABASE_URL || path);

module.exports.getFirstImages = function getFirstImages() {
    return db.query(
        `SELECT * FROM images
        ORDER BY id DESC
        LIMIT 12`
    );
};

module.exports.getNextImages = function getNextImages(lastId) {
    return db.query(
        `SELECT * FROM images
        WHERE id < $1
        ORDER BY id DESC
        LIMIT 12`,
        [lastId]
    );
};

module.exports.getLastImage = function getLastImage() {
    return db.query(
        `SELECT id FROM images
        ORDER BY id ASC
        LIMIT 1`
    );
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
    return db.query(
        "SELECT * FROM comments WHERE picId = $1 ORDER BY created_at DESC",
        [id]
    );
};
// SELECT * FROM images WHERE id < $1 ORDER BY id DESC LIMIT 20 ;
