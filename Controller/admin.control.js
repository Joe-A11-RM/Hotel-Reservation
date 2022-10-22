const adminmodel = require('../Models/admin.model')
const roommodel = require('../Models/room.model')
const bcrypt = require('bcrypt')
class AdminControl {
    static Addadmin = async(req, res) => {
        try {
            let msg = await adminmodel.create(
                req.body
            )
            await msg.save()
            res.send(msg)
        } catch (error) {
            res.send({
                apiStatus: false,
                message: error.message
            })
        }
    }
    static Login = async(req, res) => {
        try {
            let Adminname = await adminmodel.findOne({
                name: req.body.name
            })
            if (!Adminname) {
                throw new Error("Can't find this admin")
            }
            const isPassword = await bcrypt.compare(req.body.password, Adminname.password)
            if (isPassword) {
                Adminname.generateToken()
                res.send(Adminname)
            }
        } catch (error) {
            res.send({
                apiStatus: false,
                message: error.message
            })
        }
    }

    static Logout = async(req, res) => {
        try {
            let AdminId = await adminmodel.findOne({
                _id: req.params.id
            })
            if (AdminId) {
                for (let token of AdminId.tokens) {
                    if (token.token == req.token) {
                        let index = AdminId.tokens.indexOf(token)
                        AdminId.tokens.pop(index)
                        await AdminId.save()
                    }
                }
                res.send(AdminId)
            }
        } catch (error) {
            res.send({
                apiStatus: false,
                message: error.message
            })
        }
    }

    static AddRoom = async(req, res) => {
        try {
            let roomdetails = await new roommodel({
                class: req.body.class,
                roomnumber: req.body.roomnumber,
                capacity: req.body.capacity,
                description: req.body.description,
            })
            roomdetails.fileImages.push({ fileImage: req.files })
            console.log(req.files)
            await roomdetails.save()
            res.send(roomdetails)
        } catch (error) {
            res.send({
                apiStatus: false,
                message: error.message
            })
        }

    }
}
module.exports = AdminControl