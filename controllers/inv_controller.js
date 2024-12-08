const invModel = require('../models/inv_model');
const utilities = require('../utilities/');

const invCont = {}

/*
Display the full inventory by classification ID

 */
invCont.buildByClassificationId = async function (req, res, next) {
  const data = await invModel.getInventoryByClassificationId(req.params.classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
  res.render('./inventory/classification',{
      title: `${className} vehicles`, nav, grid
  })
}

invCont.buildByInvId = async function (req, res, next) {
  const data = await invModel.getDetailByInvId(req.params.inv_id);
  const grid = await utilities.buildDetailGrid(data);
  let nav = await utilities.getNav();
  const carName = `${data.inv_make} ${data.inv_model}`;
  res.render('./inventory/detail', {
    title: carName, nav, grid
  })
}

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

invCont.buildNewInv = async (req, res, next) => {
  let nav = await utilities.getNav();
  const classification_options = await utilities.buildClassificationFormOptions();
  res.render('./inventory/management', {
    title: 'Inventory', nav, classification_options, errors: null
  })
}

invCont.getInventoryJSON = async function (req, res, next) {
  const classification_id = parseInt(req.params.classification_id);
  const invData = await invModel.getInventoryByClassificationId(classification_id);
  if (invData.length > 0 && invData[0].classification_id) {
    return res.json(invData);
  }  if (invData.length === 0 && classification_id > 0) {
    req.flash('notice--error', 'No Current Inventory');
    return res.json({});
  }  else {
    console.log('no data');
    next(new Error("No Data Returned"));
  }
}

invCont.buildClassification = async function (req, res, next) {
  let nav = await utilities.getNav();

  res.render('./inventory/add_classification', {
    title: 'Add Classification', nav, errors: null
  })
}

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

invCont.buildInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  const classification_options = await utilities.buildClassificationFormOptions();
  res.render('./inventory/add_inventory', {
    title: 'Inventory', nav, classification_options, errors: null
  })
}

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


module.exports = invCont;