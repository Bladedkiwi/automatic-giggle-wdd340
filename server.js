/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
require("dotenv").config();
const express = require("express");
const app = express();
const expressLayouts = require('express-ejs-layouts')
const baseController = require('./controllers/base_controller');
const invRoute = require('./routes/inv_route');
const utilities = require('./utilities');

// Test 500 Error Route controller
const errRoute = require('./routes/err_route');


/* ***********************
 * Routes
 *************************/
app.set("view engine", "ejs")
    .use(expressLayouts)
    .set('layout', './layouts/layout')
    .use(require('./routes/static'))
    /**
     * Base Route
     * <p>render() retrieves the specified view which is index in this case and sends it back to the browser</p>
     * <p>{title: "Home"} Treated like a variable with supplies the value that the "head" partial file expects to receive. This gets passed to the view</p>
     */
    .get('/', utilities.handleErrors(baseController.buildHome))
    .use('/inv', utilities.handleErrors(invRoute))
    // Testing 500 error Route
    .use('/test', utilities.handleErrors(errRoute))

    /**
     * FILE NOT FOUND Route
     * Must be the last route
     */
    .use((req, res, next) => {
        const errNothing = new Error('Sorry, this page has escaped existence.');
        errNothing.status = 404;
        next(errNothing);
    })
    .use(async (err, req, res, next) => {
        let nav = await utilities.getNav();
        console.error(`Error at: "${req.originalUrl}": ${err.message}`)
        err.stack = err.stack || '';
        res.render("errors/error", {
            title: err.status || 'Server Error',
            message: err.status === 404 ? err.message : 'Oh no! There was a crash. Maybe try a different route.',
            status: err.status || 500,
            // stack: err.stack
            nav
        })
    })

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(process.env.PORT, () => {
    console.log(`app listening on ${process.env.HOST}:${process.env.PORT}`)
})
