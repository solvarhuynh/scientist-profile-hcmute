const express = require('express');
const router = express.Router();
const candidateController = require('../controllers/candidateController');

router.get('/', candidateController.getCandidates);
router.get('/stats', candidateController.getStats);

module.exports = router;
