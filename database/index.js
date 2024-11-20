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
                const res = await pool.query(text, params)
                console.log("Executed Query", {text})
                return res
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