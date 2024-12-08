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
const session = require('express-session');
const cors = require('cors');
const pool = require('./database/');
const cookieParser = require('cookie-parser');

const baseController = require('./controllers/base_controller');
const invRoute = require('./routes/inv_route');
const accRoute = require('./routes/acc_route');
const utilities = require('./utilities');

// Test 500 Error Route controller
const errRoute = require('./routes/err_route');
const {urlencoded} = require("express");

/**
 * Middleware
 */
app.use(session({
    store: new(require('connect-pg-simple')(session))({
        createTableIfMissing: true,
        pool
    }),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    name: 'sessionId'
}))
    //Express Messages
    .use(require('connect-flash')())
    .use((req,res,next)=>{
        res.locals.messages = require('express-messages')(req,res)
        next();
    })
    .use(express.json())
    .use(urlencoded({ extended: true }))
    .use(cors())
    .use(cookieParser())
    .use(utilities.checkJWTtoken)

/**
 * View Engine and Templates
 */
app.set("view engine", "ejs")
    .use(expressLayouts)
    .set('layout', './layouts/layout')
    .use(require('./routes/static'))

    /**
     * Routes
     */
    .get('/', utilities.handleErrors(baseController.buildHome))
    .use('/inv', utilities.handleErrors(invRoute))
    .use('/acc', utilities.handleErrors(accRoute))

    // Testing 500 error Route
    .use('/test', utilities.handleErrors(errRoute))

    /**
     * Error Handling Routes
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
