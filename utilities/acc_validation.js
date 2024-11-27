const utilities = require('.');
const {body, validationResult } = require('express-validator');
validate = {}

/**
 * Registration Data Validation Rules
 */

validate.registrationRules = () => {
    return [
        //firstname: required, string
        body('account_firstname')
            // no whitespaces
            .trim()
            // replace special characters with HTML entities
            .escape()
            // checks if field is empty
            .notEmpty()
            // greater than one character
            .isLength({min: 1})
            // default validation error message
            .withMessage('Please provide a first name'),

        // lastname: required, string
        body('account_lastname')
            .trim()
            .escape()
            .notEmpty()
            .isLength({min: 2})
            .withMessage('Please provide a last name'),

        //email: required, unique to DB
        body('account_email')
            .trim()
            .escape()
            .notEmpty()
            .isEmail()
            //by default converts to lowercase, removes extra whitespace, removes dots from the local part of the address, removes tags, returns it as a string
            .normalizeEmail()
            .withMessage('Please provide a valid email'),

        //password: required, strong
        body('account_password')
            .trim()
            .notEmpty()
            .isStrongPassword({
                minLength: 12,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1
            })
            .withMessage('Password does not meet requirements'),
    ]
}

//Stick those errors with Stickiness
/**
 * Check Data and return errors/continue to registration
 */

validate.checkRegData = async(req, res, next) => {
    const { account_firstname, account_lastname, account_email} = req.body;
    let errors = [];
    errors = validationResult(req);
    if(!errors.isEmpty()) {
        let nav = await utilities.getNav();
        res.render('account/register', {
            errors,
            title: 'Register',
            nav, account_firstname, account_lastname, account_email
        })
        return
    }
    next();
}

module.exports = validate