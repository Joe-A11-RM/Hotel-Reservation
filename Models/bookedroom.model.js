const mongoose = require('mongoose')
const bookedroom = mongoose.Schema({
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    roomsid: [{
        roomid: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Room"
        },
        startDate: {
            type: Date,
            required: true
        },
        endDate: {
            type: Date,
            required: true
        },
        nights: {
            type: Number,
            required: true
        }
    }],
    totalprice: {
        type: Number,
        required: true
    }
})
module.exports = mongoose.model("Bookedrooms", bookedroom)