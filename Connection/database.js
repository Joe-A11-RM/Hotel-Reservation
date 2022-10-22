const mongoose = require('mongoose')
const database = 'Hotel'
const server = '127.0.0.1:27017'
class Database {
    connect() {
        mongoose.connect(`mongodb://${server}/${database}`, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => {
                console.log("Database Connection Successfull")
            }).catch(() => {
                console.log("Database Connection Failed")
            })
    }
}
module.exports = new Database()