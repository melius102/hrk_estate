const path = require('path');
const express = require("express");
const { clog } = require('../modules/util');

const router = express.Router();

router.get("/", (req, res) => {
    // res.send("<h1>Hello world</h1>"); // send is req's method of express' app
    // res.json({ say: "hello" });
    // res.sendFile(path.join(__dirname, "public/index.html")); // absolute path of file
    // url must have '/'
    if (process.env.nodenv!=='production') {
        res.sendFile(path.join(__dirname, '../dist/public/index_dev.html'));
    } else {
        res.sendFile(path.join(__dirname, '../dist/public/index.html'));
    }
});

module.exports = router;