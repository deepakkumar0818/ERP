const express = require("express");
const router = express.Router();
const { createUser, login } = require("../controller/user.controller");

// user routes
router.post("/register", createUser);
router.post("/login", login);

// test route
router.get("/test", (req, res) => {
    res.send("Route working");
});

module.exports = router;
