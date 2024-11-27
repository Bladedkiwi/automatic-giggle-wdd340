const express = require('express');
const router = express.Router();
const accCont = require('../controllers/acc_controller.js');
const utilities = require('../utilities');
const regValidate = require('../utilities/acc_validation');

router.get('/login', accCont.buildLogin);
router.get('/register', accCont.buildRegister);

router.post('/register',
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accCont.registerAccount))



module.exports = router;
