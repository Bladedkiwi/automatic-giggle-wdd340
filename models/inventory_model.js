const pool = require('../database/');

/*
Get Classifications
Retrieves all item names from the classification table
 */
async function getClassifications() {
    return await pool.query('SELECT * FROM public.classification ORDER BY classification_name')
}

module.exports = {getClassifications};