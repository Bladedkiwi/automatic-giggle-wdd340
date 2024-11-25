const invModel = require('../models/inv_model')
const Util = {};


//Create the Navigation Unordered List
Util.getNav = async function (req, res, next) {
    let data = await invModel.getClassifications();
    let list = '<ul>';
    list += '<li><a href="/" title="Home Page">Home</a></li>';
    data.rows.forEach((row) => {
        list += '<li>';
        list +=
            `<a href="/inv/type/${row.classification_id}" 
                title="See our inventory of ${row.classification_name} vehicles"> 
                ${row.classification_name}
            </a> `;
        list += '</li>';
    })
    list += '</ul>';
    return list;
}

Util.buildClassificationGrid = async function (data) {
    let grid
    if (data.length > 0) {
        grid = `<ul id="inv_display" class="car__review--list">`;
        data.forEach(vehicle => {
            grid += '<li class="car--grid">'
            grid += '<a href="../../inv/detail/' + vehicle.inv_id
                + '" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model
                + 'details"><img src="' + vehicle.inv_thumbnail
                + '" alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model
                + ' on CSE Motors" /></a>'
            grid += '<div class="namePrice">'
            grid += '<h2>'
            grid += '<a href="../../inv/detail/' + vehicle.inv_id + '" title="View '
                + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">'
                + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
            grid += '</h2>'
            grid += '<span>$'
                + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
            grid += '</div>'
            grid += '</li>'
            grid += '<hr />'
        })
        grid += '</ul>';
    } else {
        grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'

    }
    return grid;
}

Util.buildDetailGrid = async function (data) {
    let grid;
    if (data) {
        let price = `$${new Intl.NumberFormat('en-US').format(data.inv_price)}`;
        let miles = new Intl.NumberFormat('en-US').format(data.inv_miles);
        grid = `<div class="car--flex">
            <img class="pad-1" src="${data.inv_image}" alt="Image of ${data.inv_make} ${data.inv_model} on CSE Motors">
            <p class="pad-1">${data.inv_description}</p>
       </div>
       <div class="car__review">
            <h4 class="car__review--title">${data.inv_year} ${data.inv_make} ${data.inv_model}</h4>
            <ul class="car__review--list">
                <li>${price}</li>
                <li>${miles}</li>
                <li>${data.inv_color}</li>
            </ul>   
        </div>
        `;
    } else {
        grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid;
}


Util.handleErrors = fn =>
    (req, res, next) =>
        Promise.resolve(fn(req, res, next)).catch(next)


module.exports = Util;