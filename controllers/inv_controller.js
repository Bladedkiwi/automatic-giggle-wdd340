const invModel = require('../models/inv_model');
const utilities = require('../utilities/');

const invCont = {}

/*
Build the inventory by classification view
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

module.exports = invCont;