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
    .get('/', baseController.buildHome)

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(process.env.PORT, () => {
    console.log(`app listening on ${process.env.HOST}:${process.env.PORT}`)
})
