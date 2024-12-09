const invModel = require('../models/inv_model');
const utilities = require('../utilities/');

const invCont = {}

/**
 ******************* CLASSIFICATIONS ***********************
 */

/**
 * Build Classification View By ID (DISPLAY)
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
invCont.buildByClassificationId = async function (req, res, next) {
  const data = await invModel.getInventoryByClassificationId(parseInt(req.params.classification_id));
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
  res.render('./inventory/classification',{
      title: `${className} vehicles`, nav, grid, errors: null
  })
}

/**
 * Build ADD Classification View (DISPLAY)
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
invCont.buildClassification = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render('./inventory/add_classification', {
    title: 'Add Classification', nav, errors: null
  })
}

/**
 * Add New Classification (DATABASE ACCESS)
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
invCont.addClassification = async function (req, res, next) {
  let nav = await utilities.getNav();
  const {classification_name} = req.body;
  const classificationResult = await invModel.addClassification(classification_name);
  if (classificationResult) {
    req.flash('notice--success', 'Classification Successfully Added');
    nav = await utilities.getNav();
    res.status(201).render('./inventory/add_classification', {
      title: 'Add Classification', nav, errors: null
    })
  } else {
    req.flash('notice--error', 'Sorry, the addition of a new classification failed.');
    res.status(501).render('./inventory/add_classification', {
      title: 'Add Classification', nav, errors: null
    })
  }
}

/**
 * ***********************************INVENTORY*********************************
 */

/**
 * Build Inv Listings By ID (DISPLAY)
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
invCont.buildByInvId = async function (req, res, next) {
  const data = await invModel.getDetailByInvId(req.params.inv_id);
  const grid = await utilities.buildDetailGrid(data);
  let nav = await utilities.getNav();
  const carName = `${data.inv_make} ${data.inv_model}`;
  res.render('./inventory/detail', {
    title: carName, nav, grid
  })
}

/**
 * Build New Inventory (DISPLAY)
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
invCont.buildNewInv = async (req, res, next) => {
  let nav = await utilities.getNav();
  const classification_options = await utilities.buildClassificationFormOptions();
  res.render('./inventory/management', {
    title: 'Inventory', nav, classification_options, errors: null
  })
}

/**
 * Get Inventory JSON  (JSON INVENTORY)
 * Builds a table for displaying inventory by classification options
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
invCont.getInventoryJSON = async function (req, res, next) {
  const classification_id = parseInt(req.params.classification_id);
  const invData = await invModel.getInventoryByClassificationId(classification_id);
  if (invData.length > 0 && invData[0].classification_id) {
    return res.json(invData);
  }  if (invData.length === 0 && classification_id > 0) {
    return res.json({});
  }  else {
    console.log('no data');
    next(new Error("No Data Returned"));
  }
}

/**
 * Build Inventory (DISPLAY)
 * Displays the form to add new vehicles to the database
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
invCont.buildInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  const classification_options = await utilities.buildClassificationFormOptions();
  res.render('./inventory/add_inventory', {
    title: 'Inventory', nav, classification_options, errors: null
  })
}

/**
 * Add Detail (DATABASE ACCESS)
 * Process of adding a specific vehicle to the database
 *  - based of the /inv/detail url
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
invCont.addDetail = async function (req, res, next) {
  let nav = await utilities.getNav();

  const {inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id} = req.body;

  const detailResult = await invModel.addInventory(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id);
  if (detailResult) {
    req.flash('notice--success', 'Inventory Successfully Added.');
        res.status(201).render('inventory/management', {
      title: 'Inventory', nav, errors: null
    });
  } else {
    req.flash('notice--error', 'Sorry, there was an error in adding additional inventory.' );
    res.status(501).render('inventory/add_inventory', {
      title: 'Add Inventory', nav, errors:null
    })
  }
}

/**
 * Build EDIT by inv ID (DISPLAY)
 * Displays the form to edit a vehicle's details
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
invCont.buildEditByInvId = async function (req, res, next) {
  let nav = await utilities.getNav();
  const inv_id = parseInt(req.params.inv_id);
  const invData = await invModel.getDetailByInvId(inv_id);
  const classification_options = await utilities.buildClassificationFormOptions(invData.classification_id);
  const invName = `${invData.inv_make} ${invData.inv_model}`
  res.render("./inventory/edit_inventory", {
    title: "Edit " + invName,
    nav,
    classification_options,
    errors: null,
    inv_id: invData.inv_id,
    inv_make: invData.inv_make,
    inv_model: invData.inv_model,
    inv_year: invData.inv_year,
    inv_description: invData.inv_description,
    inv_image: invData.inv_image,
    inv_thumbnail: invData.inv_thumbnail,
    inv_price: invData.inv_price,
    inv_miles: invData.inv_miles,
    inv_color: invData.inv_color,
    classification_id: invData.classification_id
  })
}

/**
 * EDIT Inv by ID (DATABASE ACCESS)
 * Process of editing the vehicle and sending the updates to the database
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
invCont.editInvById = async function (req, res, next) {
  let nav = await utilities.getNav();

  const {inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id} = req.body;
  const editResult = await invModel.editInventory(inv_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id);

  if (editResult) {
    const invName = `${editResult.inv_make} ${editResult.inv_model}`
    req.flash('notice--success', `The ${invName} was successfully updated.`);
    res.redirect('/inv/');
  } else {
    const classification_options = await utilities.buildClassificationFormOptions(classification_id);
    const invName = `${editResult.inv_make} ${editResult.inv_model}`
    req.flash('notice--error', 'Sorry, the update failed.' );
    res.status(501).render('inventory/edit_inventory', {
      title: `Edit ${invName}`, nav, errors:null, classification_options, inv_id,inv_make,inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id
    })
  }
}

invCont.buildDeleteInv = async (req, res, next) => {
  let nav = await utilities.getNav();
  const inv_id = parseInt(req.params.inv_id);
  const invData = await invModel.getDetailByInvId(inv_id);
  const classification_options = await utilities.buildClassificationFormOptions(invData.classification_id);
  const invName = `${invData.inv_make} ${invData.inv_model}`
  res.render("./inventory/delete_inventory", {
    title: "Delete " + invName,
    nav,
    classification_options,
    errors: null,
    inv_id: invData.inv_id,
    inv_make: invData.inv_make,
    inv_model: invData.inv_model,
    inv_price: invData.inv_price,
    inv_year: invData.inv_year,
  })
}

invCont.deleteInvById = async (req, res, next) => {
  let nav = await utilities.getNav();

  const {inv_id, inv_make, inv_model,inv_price, inv_year, classification_id} = req.body;
  const deleteResult = await invModel.deleteInventory(inv_id);

  if (deleteResult) {
    req.flash('notice--success', `Deletion was Successful.`);
    res.redirect('/inv/');
  } else {
    const classification_options = await utilities.buildClassificationFormOptions(classification_id);
    const invName = `${deleteResult.inv_make} ${deleteResult.inv_model}`
    req.flash('notice--error', 'Sorry, deletion failed.' );
    res.status(501).render('inventory/delete_inventory', {
      title: `Delete ${invName}`, nav, errors:null, classification_options, inv_id,inv_make,inv_model, inv_price, inv_year, classification_id
    })
  }

}

module.exports = invCont;