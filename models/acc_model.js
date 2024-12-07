const pool = require('../database/');

/**
 * Register New Account
 */

async function registerAccount(account_firstname, account_lastname, account_email, account_password) {
    try {
        const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'client') RETURNING *"
        return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password]);
    } catch (error) {
        return error.message;
    }
}

/**
 * Check for Existing Email
 */
async function checkExistingEmail(account_email) {
    try {
        const sql = "SELECT * FROM account WHERE account_email = $1";
        const email = await pool.query(sql, [account_email]);
        return email.rowCount;
    } catch (error) {
        return error.message;
    }
}

/**
 * Check if user exists
 */
async function checkExistingUser(account_email, account_password) {
    try {
        const sql = "SELECT * FROM account WHERE (account_email = $1, account_password = $2)";
        const user = await pool.query(sql, [account_email, account_password]);
        return user.rowCount;
    } catch (error) {
        return error.message;
    }
}


module.exports = {registerAccount, checkExistingEmail, checkExistingUser};