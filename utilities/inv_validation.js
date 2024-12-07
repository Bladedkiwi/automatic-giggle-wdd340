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
            .notEmpty()
            .isLength({min: 1})
            .withMessage('Minimum of 3 Characters'),
        body('inv_model')
            .trim()
            .escape()
            .notEmpty()
            .isLength({min: 1})
            .withMessage('Minimum of 3 Characters'),
        body('inv_year')
            .trim()
            .escape()
            .notEmpty()
            .isLength({min: 4})
            .toInt()
            .isInt()
            .isNumeric()
            .withMessage('4-Digit Year'),
        body('inv_description')
            .optional()
            .trim()
            .escape()
            .notEmpty()
            .isLength({min: 1}),
        body('inv_image')
            .optional()
            .trim()
            .escape()
            .notEmpty()
            .isLength({min: 1})
            .customSanitizer(value => he.decode(value))
            .matches(/^\/images\/vehicles\/.*\.(jpg|png)$/)
            .withMessage('Must be formatted like so: /images/vehicles/example.(jpg,png)'),
        body('inv_thumbnail')
            .optional()
            .trim()
            .escape()
            .notEmpty()
            .isLength({min: 1})
            .customSanitizer(value => he.decode(value))
            .matches(/^\/images\/vehicles\/.*\.(jpg|png)$/)
            .withMessage('Must be formatted like so: /images/vehicles/example.(jpg,png)'),
        body('inv_price')
            .trim()
            .escape()
            .notEmpty()
            .isLength({min: 1})
            .isNumeric()
            .toFloat()
            .isFloat()
            .withMessage('Decimals or Integers'),
        body('inv_miles')
            .trim()
            .escape()
            .notEmpty()
            .isLength({min: 4})
            .isNumeric()
            .toInt()
            .isInt()
            .withMessage('Digits Only'),
        body('inv_color')
            .trim()
            .escape()
            .notEmpty()
            .isLength({min: 1})
            .withMessage('Alphabetical Letters Only'),
        body('classification_id')
            .trim()
            .escape()
            .notEmpty()
            .isLength({min: 1})
            .withMessage('Please select a Classification'),
    ]
}

validate.checkDetailData = async (req,res,next) => {
    const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body;
    let errors;
    errors = validationResult(req);
    if(!errors.isEmpty()) {
        let nav = await utilities.getNav();
        let classification_options = utilities.buildClassificationFormOptions(classification_id);

        res.render('inventory/add_inventory', {
            errors,
            title: 'Add Inventory',
            nav, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_options
        })
        return
    }
    next();
}

module.exports = validate;