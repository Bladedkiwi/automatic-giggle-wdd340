require('dotenv').config();
const utilities = require('../utilities');
const accModel = require('../models/acc_model')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const invModel = require("../models/inv_model");


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
    res.render('./account/management', {
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

async function accountLogout(req,res,next) {
    res.clearCookie('jwt');
    delete res.locals.accountData;
    res.locals.loggedIn = 0;
    res.redirect('/acc/login')
}

/**
 * Build UPDATE by account ID (DISPLAY)
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
async function buildUpdateAccountById(req, res, next) {
    let nav = await utilities.getNav();

    const account_id = parseInt(req.params.account_id);
    const retrieveAccount = await accModel.getAccountById(account_id);
    if (retrieveAccount.account_id !== res.locals.accountData.account_id) {
        res.redirect('/acc/');
        next();
    }
    res.render("./account/update_account", {
        title: "Update Profile",
        nav,
        errors: null,
        account_id: retrieveAccount.account_id,
        account_firstname: retrieveAccount.account_firstname,
        account_lastname: retrieveAccount.account_lastname,
        account_email: retrieveAccount.account_email,
    })
}

async function updateAccount(req,res,next) {
    let nav = await utilities.getNav();
    const {account_id, account_firstname, account_lastname, account_email, account_password} = req.body;
    let updateResult = []
    if (!account_password) {
        console.log('no password submitted');
        //Submit account data
        updateResult = await accModel.updateAccountById(account_id, account_firstname, account_lastname, account_email);
    } else {
        // password to update
        if (account_password !== '') {
            const hashedPassword = await bcrypt.hashSync(account_password, 10);
            updateResult = await accModel.updateAccountPassById(account_id, hashedPassword);
        }
    }
    if (updateResult) {
        req.flash('notice--success', `Your account was successfully updated.`);
        res.redirect('/acc/');
    } else {
        const accName = `${updateResult.account_firstname}`
        req.flash('notice--error', 'Sorry, the update failed.' );
        res.status(501).render('account/update_account', {
            title: `Update ${accName}`, nav, errors:null,  account_id, account_firstname, account_lastname, account_email
        })
    }
}

async function buildAccounts(req, res, next) {
    let nav = await utilities.getNav();
    res.render('account/view_accounts', {
        title: 'Manage Accounts', nav,  errors:null } )

}

async function getAccountsJSON (req, res, next) {
    const account_type = req.params.account_type;
    const accountList = await accModel.getAccountsByType(account_type);
    if (accountList.length > 0) {
        return res.json(accountList);
    }  if (accountList.length === 0) {
        return res.json({});
    }  else {
        next(new Error("No Data Returned"));
    }
}

async function updateAccountTypeById (req, res, next) {
    const {account_id, account_type } = req.params;
    const updateResult = await accModel.updateAccountType(account_type, account_id);
    if (updateResult) {
        return res.json({ success: true, message: 'Account type updated successfully' });
    } else {
        return res.json({ success: false, message: 'Failed to update.' })
    }

}



module.exports = {
    buildLogin,
    buildRegister,
    registerAccount,
    accountLogin,
    accountLogout,
    buildAccountManagement,
    buildUpdateAccountById,
    updateAccount,
    buildAccounts,
    getAccountsJSON,
    updateAccountTypeById

};

