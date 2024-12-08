const utilities = require('.');
const invModel = require('../models/inv_model');
const {body, validationResult } = require('express-validator');
validate = {}
const he = require('he');



/**
 * Validate Inventory Classification
 */

validate.classificationRules = () => {
    return [
        body('classification_name')
            .trim()
            .escape()
            .notEmpty()
            .isLength({min: 1})
            .withMessage('Alphabetical Letters Only without any special characters or spaces.')
    ]
}

validate.checkClassificationData = async (req,res,next) => {
    const classification_name = req.body;
    let errors = [];
    errors = validationResult(req);
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        res.render('inventory/add_classification', {
            errors, title: 'Add Classification',
            nav, classification_name
        })
        return
    }
    next();
}

validate.detailRules = () => {
    return [
        body('inv_make')
            .trim()
            .escape()
            .notEmpty().withMessage('Field can not be empty.')
            .isLength({min: 1}).withMessage('Minimum of 3 Characters'),
        body('inv_model')
            .trim()
            .escape()
            .notEmpty().withMessage('Field can not be empty.')
            .isLength({min: 1}).withMessage('Minimum of 3 Characters'),
        body('inv_year')
            .trim()
            .escape()
            .notEmpty().withMessage('Field can not be empty.')
            .isLength({min: 4}).withMessage('4-digit Year')
            .toInt()
            .isInt().withMessage('Must be an Integer.')
            .isNumeric().withMessage('4-Digit Year'),
        body('inv_description')
            .optional()
            .trim()
            .escape()
            .notEmpty().withMessage('Field can not be empty.')
            .isLength({min: 1}).withMessage('Provide a detailed Description.'),
        body('inv_image')
            .optional()
            .trim()
            .escape()
            .notEmpty().withMessage('Field can not be empty.')
            .isLength({min: 1}).withMessage('File must be provided')
            .customSanitizer(value => he.decode(value))
            .matches(/^\/images\/vehicles\/.*\.(jpg|png)$/)
            .withMessage('Format like: /images/vehicles/ (jpg,png)'),
        body('inv_thumbnail')
            .optional()
            .trim()
            .escape()
            .notEmpty().withMessage('Field can not be empty.')
            .isLength({min: 1}).withMessage('File must be provided')
            .customSanitizer(value => he.decode(value))
            .matches(/^\/images\/vehicles\/.*\.(jpg|png)$/)
            .withMessage('Format like: /images/vehicles/ (jpg,png)'),
        body('inv_price')
            .trim()
            .escape()
            .notEmpty().withMessage('Field can not be empty.')
            .isNumeric().withMessage('Must be a valid number.')
            .toFloat()
            .isFloat().withMessage('Decimals or Integers'),
        body('inv_miles')
            .trim()
            .escape()
            .notEmpty().withMessage('Field can not be empty.')
            .isNumeric().withMessage('Must be a valid number.')
            .toInt()
            .isInt().withMessage('Digits Only'),
        body('inv_color')
            .trim()
            .escape()
            .notEmpty().withMessage('Field can not be empty.')
            .isLength({min: 1}).withMessage('Alphabetical Letters Only'),
        body('classification_id')
            .trim()
            .escape()
            .notEmpty().withMessage('Field can not be empty.')
            .isLength({min: 1}).withMessage('Please select a Classification'),
    ]
}

validate.checkDetailData = async (req,res,next) => {
    const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body;
    let errors;
    errors = validationResult(req);
    if(!errors.isEmpty()) {
        let nav = await utilities.getNav();
        let classification_options = await utilities.buildClassificationFormOptions(classification_id);
        const groupedErrors = {};
        errors.array().forEach(error => {
            if (!groupedErrors[error.path]) {
                groupedErrors[error.path] = [];
            }
            groupedErrors[error.path].push(error.msg);
        })
        errors = groupedErrors;
        res.render('inventory/add_inventory', {
            errors,
            title: 'Add Inventory',
            nav, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_options
        })
        return
    }
    next();
}


validate.checkEditInvById = async (req,res,next) => {
    const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id, inv_id } = req.body;
    let errors;
    errors = validationResult(req);
    if(!errors.isEmpty()) {
        let nav = await utilities.getNav();
        let classification_options = await utilities.buildClassificationFormOptions(classification_id);
        const groupedErrors = {};
        errors.array().forEach(error => {
            if (!groupedErrors[error.path]) {
                groupedErrors[error.path] = [];
            }
            groupedErrors[error.path].push(error.msg);
        })
        errors = groupedErrors;
        res.render('inventory/edit_inventory', {
            errors,
            title:`Edit ${inv_make} ${inv_model}`,
            nav, inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_options
        })
        return
    }
    next();
}

module.exports = validate;