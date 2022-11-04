const adminmodel = require('../Models/admin.model')
const roommodel = require('../Models/room.model')
const usermodel = require('../Models/user.model')
const bcrypt = require('bcrypt')
const bookedroomModel = require('../Models/bookedroom.model')
let Calculate = async(hotel) => {
    var subtotal = 0
    for (let room of hotel.roomsid) {
        const diffTime = Math.abs(room.endDate - room.startDate);
        room.nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        console.log(room.roomid.price)
        subtotal = subtotal + (room.roomid.price * room.nights)

    }
    return subtotal
}
Date.prototype.addDays = function(days) {
    const date = new Date(this.valueOf())
    date.setDate(date.getDate() + days)
    return date
}
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
                price: req.body.price
            })
            for (let image = 0; image < req.files.length; image++) {
                await roomdetails.fileImages.push({ fileImage: req.files[image] })
                    //console.log(image)
            }
            //console.log(req.files)
            await roomdetails.save()
            res.send(roomdetails)
        } catch (error) {
            res.send({
                apiStatus: false,
                message: error.message
            })
        }
    }

    static DeleteRoom = async(req, res) => {
        try {
            let deletedroom = await roommodel.findByIdAndDelete({
                _id: req.params.id
            })
            res.send(deletedroom)
        } catch (error) {
            res.send({
                apiStatus: false,
                message: error.message
            })
        }

    }

    static EditRoomInf = async(req, res) => {
        try {
            let roominf = await roommodel.findByIdAndUpdate({
                _id: req.params.id
            }, {
                class: req.body.class,
                roomnumber: req.body.roomnumber,
                capacity: req.body.capacity,
                description: req.body.description
            })
            await roominf.save()
            res.send(roominf)
        } catch (error) {
            res.send({
                apiStatus: false,
                message: error.message
            })
        }
    }

    static EditRoomImage = async(req, res) => {
        try {
            let roomimage = await roommodel.findById({
                _id: req.params.id
            })
            if (roomimage) {
                for (let filename of roomimage.fileImages) {
                    console.log(filename.fileImage.filename)
                    if (filename.fileImage.filename == req.params.filename) {
                        console.log("Done Condition")
                        console.log(req.params.filename)
                        console.log(filename.fileImage.filename)
                        let index = roomimage.fileImages.indexOf(filename)
                        console.log(index)
                        await roomimage.fileImages.splice(index, 1)
                        await roomimage.fileImages.push({ fileImage: req.body })
                    }
                }
            }
            roomimage.save()
            res.send(roomimage)
        } catch (error) {
            res.send({
                apiStatus: false,
                message: error.message
            })
        }
    }
    static ShowUsers = async(req, res) => {
        try {
            let AllUsers = await usermodel.find()
            res.send(AllUsers)
        } catch (error) {
            res.send({
                apiStatus: false,
                message: error.message
            })
        }
    }
    static DeleteUser = async(req, res) => {
        try {
            let deleteuser = await usermodel.findByIdAndDelete({
                _id: req.params.id
            })
            await deleteuser.save()
            res.send(deleteuser)
        } catch (error) {
            res.send({
                apiStatus: false,
                message: error.message
            })
        }
    }
    static EditUser = async(req, res) => {
        try {
            let edituser = await usermodel.findByIdAndUpdate({
                _id: req.params.id
            }, req.body)
            await edituser.save()
            res.send(edituser)
        } catch (error) {
            res.send({
                apiStatus: false,
                message: error.message
            })
        }
    }
    static EditBookedRoom = async(req, res) => {
        try {
            let msg = await bookedroomModel.findByIdAndUpdate({
                _id: req.body.id
            }, req.body)
            await msg.populate({ path: "roomsid.roomid", strictPopulate: false })
            console.log(msg)
                //await msg.save()
            res.send(msg)
        } catch (error) {
            res.send({
                apiStatus: false,
                message: error.message
            })
        }
    }
    static DeleteBookedRoom = async(req, res) => {
        try {
            let deletebooked = await bookedroomModel.findOneAndDelete({
                    _id: req.params.id
                })
                //await deletebooked.save()
            res.send(deletebooked)
        } catch (error) {
            res.send({
                apiStatus: false,
                message: error.message
            })
        }
    }
}
module.exports = AdminControl