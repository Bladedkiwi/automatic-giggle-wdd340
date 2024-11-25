const express = require('express');
const router = express.Router();
const footCont = require('../controllers/footer_controller');

// Building the inventory by classification view
router.get('/', footCont.buildErrorByClick);

module.exports = router;
