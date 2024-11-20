require('dotenv').config();
const {Pool} = require('pg');

// SSL Object allowing local testing for development purposes
let pool
if (process.env.NODE_ENV === 'development') {
    pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    })


    module.exports = {
        async query(text, params) {
            try {
                return await pool.query(text, params)
            } catch (err) {
                console.error('Error in Query', {text})
                throw err
            }
        }
    }

} else {
    pool = new Pool({
        connectionString: process.env.DATABASE_URL
    })
    module.exports = pool;
}