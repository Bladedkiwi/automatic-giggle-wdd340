const pool = require('../database/');

/*
Get Classifications
Retrieves all item names from the classification table
 */
async function getClassifications() {
    return await pool.query('SELECT * FROM public.classification ORDER BY classification_name')
}

/*
Get all inventory and classification_name by classification_id
 */
async function getInventoryByClassificationId(classification_id) {
    try {
        const data = await pool.query(
            `SELECT c.classification_name, i.*
             FROM public.classification AS c
                      LEFT JOIN public.inventory AS i ON c.classification_id = i.classification_id
             WHERE c.classification_id = $1`,
            [classification_id]
        );
        return data.rows
    } catch (error) {
        console.error('getInventoryByClassificationId' + error);
        throw error;
    }
}


// /*
// Get Specific Detail By ID
//  */
async function getDetailByInvId(inv_id) {
    try {
        const data = await pool.query(
            "SELECT * FROM public.inventory WHERE inv_id = $1",
            [inv_id]
        )
        return data.rows[0];
    } catch (error) {
        console.error('getDetailByInvId' + error);
        throw error;
    }
}

/**
 * Add New Classification Type
 * @param classification_name
 * @returns {Promise<*|undefined>}
 */
async function addClassification(classification_name) {
    try {
        const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *"
        return await pool.query(sql, [classification_name]);
    } catch (error) {
        return error.message;
    }
}

async function addInventory(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) {
    try {
        const sql = "INSERT INTO inventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *"
        return await pool.query(sql, [inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id]);
    } catch (error) {
        return error.message;
    }
}


async function editInventory(
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
) {
    try {
        const sql =
            "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *"
        const data = await pool.query(sql, [
            inv_make,
            inv_model,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_year,
            inv_miles,
            inv_color,
            classification_id,
            inv_id
        ])
        return data.rows[0]
    } catch (error) {
        console.error("model error: " + error);
        new Error('Edit Inventory Error');
    }
}

async function deleteInventory(
    inv_id
) {
    try {
        const sql =
            "DELETE FROM inventory WHERE inv_id = $1";
        return await pool.query(sql, [
            inv_id
        ])
    } catch (error) {
        console.error("Delete Inventory error: " + error)
        new Error('Delete Inventory Error')
    }
}


module.exports = {
    getClassifications,
    getInventoryByClassificationId,
    getDetailByInvId,
    addClassification,
    addInventory,
    editInventory,
    deleteInventory,

};