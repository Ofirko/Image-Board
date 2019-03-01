const express = require("express");
const app = express();
const db = require("./db");
app.use(express.static("./public"));
var multer = require("multer");
var uidSafe = require("uid-safe");
var path = require("path");
const s3 = require("./s3");
const config = require("./config");
const bodyParser = require("body-parser");
app.use(bodyParser.json());
var diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

var uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

app.get("/get-images", (req, res) => {
    console.log("get images invoked");
    db.getAllImages()
        .then(data => {
            console.log(data.rows);
            res.json(data.rows);
        })
        .catch(err => {
            console.log("db error", err);
        });
});

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    console.log("upload invoked");
    console.log("req", req.body.title);
    let picurl = config.s3Url + req.file.filename;
    console.log(picurl);
    db.uploadImage(
        picurl,
        req.body.username,
        req.body.title,
        req.body.description
    )
        .then(data => {
            console.log(data.rows);
            res.json(data.rows);
        })
        .catch(err => {
            console.log("db error", err);
        });
});

app.get("/current-image/", (req, res) => {
    console.log("current image invoked");
    db.fetchImage(req.query.id)
        .then(data => {
            console.log(data.rows);
            res.json(data.rows);
        })
        .catch(err => {
            console.log("db error", err);
        });
});

app.post("/addComment", (req, res) => {
    console.log("addcomment invoked");
    console.log(req.body);
    db.addComment(req.body.username, req.body.comment, req.body.picId)
        .then(list => {
            console.log("sql result", list.rows);
            res.json(list.rows);
        })
        .catch(err => {
            console.log("db error", err);
        });
});
app.listen(8080, () => console.log("listening!"));
