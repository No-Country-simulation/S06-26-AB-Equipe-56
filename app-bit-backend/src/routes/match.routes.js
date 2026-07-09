const express = require('express');
const router = express.Router();
const { processarMatch } = require('../controllers/MatchController');

router.post('/', processarMatch);

module.exports = router;
