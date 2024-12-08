require('dotenv').config();
const utilities = require('../utilities');
const accModel = require('../models/acc_model')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


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

async function buildAccountManagement(req,res,next) {
    let nav = await utilities.getNav();
    const {account_firstname, account_lastname, account_email} = req.body;
    res.render('account/management', {
        title: 'Management', nav, errors: null
    })

}

async function accountLogin(req,res,next) {
    let nav = await utilities.getNav();
    const { account_email, account_password } = req.body;
    const accountData = await accModel.getAccountByEmail(account_email);
    if (!accountData) {
        req.flash('notice--error', "Please check your credentials and try again.")
        res.status(400).render('account/login', {
            title: 'Login', nav, errors: null,account_email
        })
        return;
        }

    try {
        const test = await bcrypt.compare(account_password, accountData.account_password);
        console.log(test);
        if (await bcrypt.compare(account_password, accountData.account_password)) {
            delete accountData.account_password;
            const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, {expiresIn: 3600 * 1000 });
            if (process.env.NODE_ENV === 'development') {
                res.cookie('jwt', accessToken, {
                    httpOnly: true,
                    maxAge: 3600 * 1000
                });
            } else {
                res.cookie('jwt', accessToken, {
                    httpOnly: true,
                    secure: true,
                    maxAge: 3600 * 1000
                })
            }
            return res.redirect('/acc/');

        } else {
            req.flash("notice--error", "Please check your credentials and try again.")
            res.status(400).render("account/login", {
                title: "Login",
                nav,
                errors: null,
                account_email,
        })
    }
} catch (error) {
    throw new Error('Access Forbidden')
    }
}



module.exports = {
    buildLogin,
    buildRegister,
    registerAccount,
    accountLogin,
    buildAccountManagement
};

