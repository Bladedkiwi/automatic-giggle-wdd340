const express = require('express');
const router = express.Router();
const invController = require('../controllers/inv_controller');

// Building the inventory by classification view
router.get('/type/:classification_id', invController.buildByClassificationId)

module.exports = router;
