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

async function checkExistingEmailForUpdate(account_email, account_id) {
    try {
        const sql = "SELECT * FROM account WHERE account_email = $1 AND account_id != $2 "
        const email = await pool.query(sql, [account_email,account_id])
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

/**
 * Return account data using email
 */
async function getAccountByEmail (account_email) {
    try {
        const result = await pool.query(
            'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
        [account_email])
        return result.rows[0];
    } catch (error) {
        return new Error('No matching email found');
    }
}

/**
 * Return account data using ID
 */
async function getAccountById (account_id) {
    try {
        const result = await pool.query(
            'SELECT account_id, account_firstname, account_lastname, account_email  FROM account WHERE account_id = $1',
            [account_id])
        return result.rows[0];
    } catch (error) {
        return new Error('No matching id found');
    }
}

async function updateAccountById(
    account_id,
    account_firstname,
    account_lastname,
    account_email,
    account_password
) {
    try {
        const sql =
            "UPDATE public.account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4 RETURNING *"
         const data = await pool.query(sql, [
            account_firstname,
            account_lastname,
            account_email,
            account_id
        ])
        return data.rows
    } catch (error) {
        console.error("model error: " + error);
        new Error('Edit Account Error');
    }
}

async function updateAccountPassById (account_id, account_password) {
    try {
        const sql =
            "UPDATE public.account SET account_password = $1 WHERE account_id = $2 RETURNING *"
        const data = await pool.query(sql, [
            account_password,
            account_id
        ])
        return data.rows;
    } catch (error) {
        console.error("model error: " + error);
        new Error('Edit Account Error');
    }
}

async function getAccountsByType (account_type) {
    try {
        const data = await pool.query("SELECT * FROM public.account WHERE account_type = $1", [account_type])
    return data.rows;
    } catch (error) {
        console.error('GetAccountByType DB Error:' + error);
        throw error;
    }
}

async function updateAccountType (account_type, account_id) {
    try {
        const sql =
            "UPDATE public.account SET account_type = $1 WHERE account_id = $2 RETURNING * "
        const data = await pool.query(sql, [account_type, account_id]);
        return data.rows;
    } catch (error) {
        console.error('Update Account Type DB Error: ' + error);
        throw error;
    }
}

module.exports = {
    registerAccount,
    checkExistingEmail,
    checkExistingUser,
    getAccountByEmail,
    getAccountById,
    updateAccountById,
    updateAccountPassById,
    checkExistingEmailForUpdate,
    getAccountsByType,
    updateAccountType,

};