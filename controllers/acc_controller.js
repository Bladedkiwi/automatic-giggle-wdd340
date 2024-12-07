const utilities = require('../utilities');
const accModel = require('../models/acc_model')
const bcrypt = require('bcryptjs');


/**
 * Deliver Login View
 */
async function buildLogin(req,res,next) {
    let nav = await utilities.getNav();

    res.render('account/login', {
        title: 'Login', nav, errors: null
    })
}

async function buildRegister(req,res,next) {
    let nav = await utilities.getNav();

    res.render('account/register', {
        title: 'Register', nav, errors: null
    })
}

async function registerAccount(req,res) {
    let nav = await utilities.getNav();
    const {account_firstname, account_lastname, account_email, account_password} = req.body;
    let hashedPassword;
    try {
        //regular password and cost ( salt is generated automatically)
        hashedPassword = await bcrypt.hashSync(account_password, 10);

    } catch(err) {
        req.flash('notice--error', 'Sorry, there was an error processing the registration.')
        res.status(500).render('account/register', {
            title: 'Register', nav, errors: null
        })
    }
    const regResult = await accModel.registerAccount(
        account_firstname,
        account_lastname,
        account_email,
        hashedPassword
    );

    if(regResult) {
        req.flash('notice--success', `Congratulations! you're registered ${account_firstname}! Please Log in.`);
        res.status(201).render('account/login', {
            title: 'Login', nav, errors: null
        });
    } else {
        req.flash('notice--error', 'Sorry, the registration failed.');
        res.status(501).render('account/register', {
            title: "Register", nav, errors: null
        })
    }
}




module.exports = {buildLogin, buildRegister, registerAccount};

