const express = require('express');
const router = express.Router();
const accCont = require('../controllers/acc_controller');
const utilities = require('../utilities');
const accValidation = require('../utilities/acc_validation');
const {updateAccountType} = require("../models/acc_model");

router.get('/login', accCont.buildLogin);
router.get('/register', accCont.buildRegister);

//Protected Routes
router.get('/update/:account_id', utilities.checkLogin, accCont.buildUpdateAccountById)
router.get('/', utilities.checkLogin, accCont.buildAccountManagement);

//Admin Routes
router.get('/accounts', utilities.checkLogin, utilities.checkManagementAuthorization, accCont.buildAccounts)
router.get('/get-acc/:account_type', utilities.checkLogin, utilities.checkManagementAuthorization, accCont.getAccountsJSON)


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
    accCont.updateAccount);

router.post('/edit-type/:account_type/:account_id',
    utilities.checkLogin,
    utilities.checkManagementAuthorization,
    accValidation.accountTypeRules(),
    accValidation.checkValidAccountType,
    accCont.updateAccountTypeById);

module.exports = router;
