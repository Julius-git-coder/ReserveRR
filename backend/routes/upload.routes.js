const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { uploadMiddleware, uploadFile } = require('../controllers/upload.controller');

router.post('/', auth, uploadMiddleware, uploadFile);

module.exports = router;

