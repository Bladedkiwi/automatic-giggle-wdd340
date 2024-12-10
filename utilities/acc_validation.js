require("dotenv").config();
const utilities = require('.');
const accModel = require('../models/acc_model');
const {body, validationResult } = require('express-validator');
accValidation = {}
const cookieParser = require('cookie-parser');
const req = require("express/lib/request");
/**
 * Registration Data Validation Rules
 */

accValidation.registrationRules = () => {
    return [
        //firstname: required, string
        body('account_firstname')
            // no whitespaces
            .trim()
            // replace special characters with HTML entities
            .escape()
            // checks if field is empty
            .notEmpty().withMessage('Please provide a first name.')
            // greater than one character
            .isLength({min: 1}).withMessage('Must have more than one character.'),
        // lastname: required, string
        body('account_lastname')
            .trim()
            .escape()
            .notEmpty().withMessage('Please provide a last name.')
            .isLength({min: 1})
            .withMessage('Last name must be longer than one character.'),

        //email: required, unique to DB
        body('account_email')
            .trim()
            .escape()
            .notEmpty().withMessage('Please provide an email address.')
            .normalizeEmail()
            .isEmail().withMessage('Valid Email Addresses only')
            .custom(async (account_email, {req}) => {
                if (req.body.account_id) {
                    const emailExists = await accModel.checkExistingEmail(req.body.account_id,account_email);
                    if (emailExists) {
                        throw new Error('Email already exists.');
                    }
                } else {
                    const emailExists = await accModel.checkExistingEmail(account_email);
                    if (emailExists) {
                        throw new Error('Email exists. Please log in or use a different email address.')}
                    }
                 }),
        //password: required, strong
        body('account_password')
            .trim()
            .notEmpty().withMessage('Please provide a password.')
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

accValidation.checkRegData = async(req, res, next) => {
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


accValidation.checkAccountPasswordUpdate = async(req,res,next) => {
    const {account_id, account_password} = req.body;
}

accValidation.checkAccountUpdate = async(req,res,next) => {

    if (req.body.form_type === 'password_update') {
        errors = validationResult(req);
        const groupedErrors = {};
        errors.array().forEach(error => {
            if (!groupedErrors[error.path]) {
                groupedErrors[error.path] = [];
            }
            groupedErrors[error.path].push(error.msg);
        })
        errors = groupedErrors;
        if (errors.account_firstname) {delete errors.account_firstname }
        if (errors.account_lastname) {delete errors.account_lastname;}
        if (errors.account_email) {delete errors.account_email;}
        if (!errors) {
            let account_firstname = res.locals.accountData.account_firstname;
            let account_lastname = res.locals.accountData.account_lastname;
            let account_email = res.locals.accountData.account_email;
            console.log(errors);
            let nav = await utilities.getNav();
            res.render('account/update_account',
                nav, errors, req.body.account_id, account_firstname, account_lastname, account_email);
        }
    }
    if (req.body.form_type === 'account_update') {
        errors = validationResult(req);

        const groupedErrors = {};
        errors.array().forEach(error => {
            if (!groupedErrors[error.path]) {
                groupedErrors[error.path] = [];
            }
            groupedErrors[error.path].push(error.msg);
        })
        errors = groupedErrors;

        delete errors.account_password;

        if (!errors) {
            return res.redirect('/acc/update')
        } else {
            next();
        }
    } else {
            next();
    }

}


accValidation.loginRules = () => {
    return [
        //email: required, unique to DB
        body('account_email')
            .trim()
            .escape()
            .notEmpty().withMessage('Please provide an email.')
            .normalizeEmail()
            .isEmail().withMessage('Valid emails only.')
            //by default converts to lowercase, removes extra whitespace, removes dots from the local part of the address, removes tags, returns it as a string
            .custom(async (account_email) => {
                const emailExists = await accModel.checkExistingEmail(account_email);
                if (!emailExists) {
                    throw new Error('Please enter valid credentials and try again.')
                }
            }),

        body('account_password')
            .trim()
            .notEmpty()
    ]
}


accValidation.checkLoginData = async(req, res, next) => {
    const { account_email} = req.body;
    let errors = [];
    errors = validationResult(req);
    if(!errors.isEmpty()) {
        let nav = await utilities.getNav();
        res.render('account/login', {
            errors,
            title: 'Login',
            nav, account_email
        })
        return
    }
    next();
}

module.exports = accValidation