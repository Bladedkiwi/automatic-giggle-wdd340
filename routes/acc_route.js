const express = require('express');
const router = express.Router();
const accCont = require('../controllers/acc_controller');
const utilities = require('../utilities');
const accValidation = require('../utilities/acc_validation');

router.get('/login', accCont.buildLogin);
router.get('/register', accCont.buildRegister);

// router.get('/', accCont.buildManagement);

router.post('/login', accValidation.loginRules(),
    accValidation.checkLoginData,(req, res) => {
    res.status(200).send('login process')
})

router.post('/register',
    accValidation.registrationRules(),
    accValidation.checkRegData,
    utilities.handleErrors(accCont.registerAccount))



module.exports = router;
