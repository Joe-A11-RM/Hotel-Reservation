const mongoose = require('mongoose')
const emailvalidator = require('validator')
const { passwordStrength } = require('check-password-strength')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
var nodemail = require('nodemailer')


const user = mongoose.Schema({
    FirstName: {
        type: String,
        required: true
    },
    LastName: {
        type: String,
        required: true
    },
    NationalID: {
        type: Number,
        required: true
    },
    Email: {
        type: String,
        required: true,
        validator(val) {
            if (!emailvalidator.isEmail(val)) {
                throw new Error("Not Email")
            }
        }
    },
    Password: {
        type: String,
        required: true,
    },
    tokens: [{
        token: {
            type: String
        }
    }],
    Pincode: {
        type: Number
    },
    createdAt: {
        type: Date
    },
    updatedAt: {
        type: Date
    }
})
user.pre('save', async function(next) {
    if (passwordStrength(this.Password).value != "Strong") {
        throw new Error("Enter Strong Password")
    }
    if (this.isModified('Password')) {
        this.Password = await bcrypt.hash(this.Password, 8)
    }
    let now = Date.now()
    this.updatedAt = now
    if (!this.createdAt) {
        this.createdAt = now
    }
    next()
})

user.methods.generateToken = async function() {
    const newtoken = await jwt.sign({ id: this._id }, "random")
    this.tokens = this.tokens.concat({ token: newtoken })
    await this.save()
    return newtoken
}
user.methods.GeneratePinCode = async function() {
    this.Pincode = Math.floor(Math.random() * 1000001)
}
user.methods.SendEmail = async function(Pincode, Email) {
    var via = nodemail.createTransport({
        service: 'gmail',
        auth: {
            user: "yousefcr72001@gmail.com",
            pass: "ciangguduivgbtzw"
        }
    })
    var options = {
        form: 'yousefcr72001@gmail.com',
        to: Email,
        subject: 'Hotel Reservation',
        text: `Your Activation Pin Code ${Pincode} `
    }
    via.sendMail(options, function(err, info) {
        if (err) {
            console.log(err)
        } else {
            console.log("Email Sent" + info.response)
        }
    })
}

module.exports = mongoose.model("User", user)