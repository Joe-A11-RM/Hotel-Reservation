const adminmodel = require('../Models/admin.model')
const jwt = require('jsonwebtoken')
const adminAuth = async(req, res, next) => {
    try {
        const givenToken = req.header("Authorization").replace("Bearer ", "")
        const token = jwt.verify(givenToken, "random")
            //console.log(token)
        const admin = await adminmodel.findById(token.id)
        req.admin = admin
        req.token = givenToken
            //console.log(admin)
        if (!admin) {
            throw new Error("Not Admin")
        }
        next()
    } catch (error) {
        res.send({
            apiStatus: false,
            message: error.message
        })
    }
}
module.exports = adminAuth