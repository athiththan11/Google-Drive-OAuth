"use strict";

var path = require("path"),
    bodyParser = require("body-parser"),
    express = require("express"),
    session = require("express-session"),
    morgan = require("morgan");

const app = express();
const port = process.env.port || 3000;

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(__dirname + "/public"));
app.set("/view", path.join(__dirname, "/public/view"));
app.use("/node", express.static(__dirname + "/node_modules"));
app.use("/bower", express.static(__dirname + "/bower_components"));

app.use(
    session({
        secret: "notasecret",
        resave: true,
        saveUninitialized: true
    })
);

var driveApi = require("./app/route/drive.api");

app.use("/api/drive", driveApi);

app.use("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.listen(port, function(err) {
    if (err) {
        console.error(err);
        return;
    }

    console.log("Server Running on port " + port);
});
