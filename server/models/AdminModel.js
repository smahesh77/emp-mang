const db = require('../config/db')


const userModel = db.model('user', new db.Schema({
    name: {
        type: 'string',
        required: true
    },
    email: {
        type: 'string',
        unique: true,
        required: true
    },
    password: {
        type: 'string',
        required: true
    },
}))


module.exports = userModel