const utilities = require('../utilities/');

const footCont = {};

footCont.buildErrorByClick = async function (req,res,next) {
    let nav = await utilities.getNav();
    res.render('./test', {
        title: 'Server Error Intentionally Triggered', nav
    })

}
module.exports = footCont