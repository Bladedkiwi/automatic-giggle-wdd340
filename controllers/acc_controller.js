const utilities = require('../utilities');
const accModel = require('../models/acc_model')
/**
 * Deliver Login View
 */
async function buildLogin(req,res,next) {
    let nav = await utilities.getNav();

    res.render('account/login', {
        title: 'Login', nav
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
    const regResult = await accModel.registerAccount(account_firstname, account_lastname, account_email, account_password);

    if(regResult) {
        req.flash('notice--success', `Congratulations! you're registered ${account_firstname}! Please Log in.`);
        res.status(201).render('account/login', {
            title: 'Login', nav
        });
    } else {
        req.flash('notice--error', 'Sorry, the registration failed.');
        res.status(501).render('account/register', {
            title: "Register", nav
        })
    }
}


module.exports = {buildLogin, buildRegister, registerAccount};

