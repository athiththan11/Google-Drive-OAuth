"use strict";

require("dotenv").config();
var fs = require("fs"),
    express = require("express"),
    { google } = require("googleapis"),
    multer = require("multer"),
    router = express.Router();

var upload = multer({ dest: "uploads/" }).single("image");

const clientId = process.env.CLIENT_ID,
    clientSecret = process.env.CLIENT_SECRET,
    redirectUrl = process.env.REDIRECT_URL,
    oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUrl),
    scopes = [
        "https://www.googleapis.com/auth/drive.file",
        "https://www.googleapis.com/auth/drive.metadata.readonly",
        "https://www.googleapis.com/auth/plus.me"
    ],
    url = oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: scopes
    }),
    drive = google.drive({
        version: "v3",
        auth: oauth2Client
    });

router.get(
    "/auth",
    (req, res) => {
        res.json({ url: url });
    },
    (err) => {
        console.error(err);
        res.send(500);
    }
);

router.use("/auth/oauthcallback", (req, res) => {
    var session = req.session;
    var code = req.query.code;
    oauth2Client.getToken(code, (err, tokens) => {
        if (err) {
            res.sendStatus(500);
        }

        oauth2Client.setCredentials(tokens);
        session["tokens"] = tokens;
        res.redirect("/home");
    });
});

router.post("/upload", upload, (req, res) => {
    var file = req.file;

    drive.files
        .create({
            requestBody: {
                name: file.originalname,
                mimeType: file.mimetype
            },
            media: {
                mimeType: file.mimetype,
                body: fs.createReadStream(file.path)
            }
        })
        .then(
            (data) => {
                fs.unlink(file.path);
                res.sendStatus(200);
            },
            (err) => {
                console.error(err);
                res.sendStatus(500);
            }
        );
});

router.get("/user", (req, res) => {
    if (req.session["tokens"]) {
        res.send(200);
    } else {
        res.send(500);
    }
});

module.exports = router;
