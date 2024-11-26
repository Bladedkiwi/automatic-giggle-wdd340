const express = require('express');
const router = express.Router();
const accCont = require('../controllers/acc_controller.js');
const utilities = require('../utilities');

router.get('/login', accCont.buildLogin);
router.get('/register', accCont.buildRegister);

router.post('/register', utilities.handleErrors(accCont.registerAccount))



module.exports = router;
