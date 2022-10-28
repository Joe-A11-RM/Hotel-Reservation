const mongoose = require('mongoose')
const room = mongoose.Schema({
    class: {
        type: String,
            required: true
    },
    roomnumber: {
        type: String,
        required: true
    },
    capacity: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    status: [{
        type: String
    }],
    fileImages: [{
        fileImage: {
            filename: {
                type: String,
                required: true
            },
            path: {
                type: String,
                required: true
            },
            mimetype: {
                type: String,
                required: true
            }
        }
    }]
})
module.exports = mongoose.model("Room", room)