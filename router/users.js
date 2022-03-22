const express = require("express");
const { updateUserValidator } = require("../utils/validator");

const router = express.Router();
const { updateUser, getCurrentUser } = require("../controllers/users");

router.get("/users/me", getCurrentUser);
router.patch("/users/me", updateUserValidator, updateUser);

module.exports = router;

// const express = require('express');
// const { getCurrentUser, updateUser } = require('../controllers/users');
// const { validationUpdateUser } = require('../utils/validations');

// const router = express.Router();
// router.get('/users/me', getCurrentUser);
// router.patch('/users/me', validationUpdateUser, updateUser);

// module.exports = router;
