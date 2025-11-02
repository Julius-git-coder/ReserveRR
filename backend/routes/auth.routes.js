const express = require('express');
const router = express.Router();
const { adminSignup, studentSignup, login } = require('../controllers/auth.controller');

router.post('/admin/signup', adminSignup);
router.post('/student/signup', studentSignup);
router.post('/login', login);

module.exports = router;

