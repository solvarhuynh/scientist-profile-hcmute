const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/', adminController.getAdmins);
router.post('/', adminController.addAdmin);
router.delete('/:email', adminController.removeAdmin);

module.exports = router;

