const router = require("express").Router();
const { signinValidator, signupValidator } = require("../utils/validator");
const { createUser } = require("../controllers/users");
const checkLogin = require("../controllers/login");

router.post("/signin", signinValidator, checkLogin);
router.post("/signup", signupValidator, createUser);

module.exports = router;

// const express = require("express");
// const { createUser } = require("../controllers/users");
// const checkLogin = require("../controllers/login");
// const {
//   validationLoginIn,
//   validationCreateUser,
// } = require("../utils/validations");

// const router = express.Router();
// router.post("/signin", validationLoginIn, checkLogin);
// router.post("/signup", validationCreateUser, createUser);

// module.exports = router;
