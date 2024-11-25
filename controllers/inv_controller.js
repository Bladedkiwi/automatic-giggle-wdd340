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



module.exports = invCont;