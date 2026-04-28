const express = require('express');
const router = express.Router();
const { getChatResponse } = require('../controllers/aiController');

router.post('/chat', getChatResponse);

module.exports = router;
