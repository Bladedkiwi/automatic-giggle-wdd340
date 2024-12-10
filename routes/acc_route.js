const express = require('express');
const router = express.Router();
const accCont = require('../controllers/acc_controller');
const utilities = require('../utilities');
const accValidation = require('../utilities/acc_validation');

router.get('/login', accCont.buildLogin);
router.get('/register', accCont.buildRegister);
router.get('/update/:account_id', utilities.checkLogin, accCont.buildUpdateAccountById)
router.get('/', utilities.checkLogin, accCont.buildAccountManagement);

router.post('/login',
    accValidation.loginRules(),
    accValidation.checkLoginData,
    accCont.accountLogin)

router.post('/register',
    accValidation.registrationRules(),
    accValidation.checkRegData,
    utilities.handleErrors(accCont.registerAccount))

router.post('/update',
    utilities.checkLogin,
    accValidation.registrationRules(),
    accValidation.checkAccountUpdate,
    accCont.updateAccount)


module.exports = router;
