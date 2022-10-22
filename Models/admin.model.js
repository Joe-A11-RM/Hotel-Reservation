const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
var jwt = require('jsonwebtoken');
const admin = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    tokens: [{
        token: {
            type: String
        }
    }]
})
admin.pre("save", async function() {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 8)
    }
})
admin.methods.generateToken = async function() {
    const newtoken = await jwt.sign({ id: this._id }, "random")
    this.tokens = this.tokens.concat({ token: newtoken })
    await this.save()
    return newtoken
}
module.exports = mongoose.model("Admin", admin)