const express = require("express");
const app = express();
const db = require("./db");
console.log(db);
app.use(express.static("./public"));

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

app.listen(8080, () => console.log("listening!"));
