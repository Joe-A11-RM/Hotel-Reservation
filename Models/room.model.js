const mongoose = require('mongoose')
const room = mongoose.Schema({
    class: {
        type: String,
            required: true
    },
    roomnumber: {
        type: Number,
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
    status: {
        type: String,
        enum: ["Available", "Not Available"],
        default: "Available"
    },
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