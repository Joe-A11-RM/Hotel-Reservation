const usermodel = require('../Models/user.model')
const roommodel = require('../Models/room.model')
const bookroommodel = require('../Models/bookedroom.model')
const bcrypt = require('bcrypt')
const date = new Date();
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
class UserControl {
    static SignUP = async(req, res) => {
        try {
            let msg = await new usermodel({
                FirstName: req.body.FirstName,
                LastName: req.body.LastName,
                NationalID: req.body.NationalID,
                Email: req.body.Email,
                Password: req.body.Password
            })
            msg.GeneratePinCode()
            msg.SendEmail(msg.Pincode, msg.Email)
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
            let UserID = await usermodel.findOne({
                NationalID: req.body.NationalID
            })
            if (!UserID) {
                throw new Error("You don't have account here")
            }
            const isPassword = bcrypt.compare(req.body.Password, UserID.Password)
            if (isPassword) {
                UserID.generateToken()
                res.send(UserID)
            } else {
                throw new Error("Wrong Password")
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
            let UserID = await usermodel.findOne({
                _id: req.params.id
            })
            if (UserID) {
                for (let token of UserID.tokens) {
                    if (token.token == req.token) {
                        let index = UserID.tokens.indexOf(token)
                        UserID.tokens.pop(index)
                        await UserID.save()
                    }
                }
                res.send(UserID)
            }
        } catch (error) {
            res.send({
                apiStatus: false,
                message: error.message
            })
        }
    }
    static UpdatePersonalData = async(req, res) => {
        try {
            let UserID = await usermodel.findByIdAndUpdate({
                _id: req.params.id
            }, {
                FirstName: req.body.FirstName,
                LastName: req.body.LastName,
                Email: req.body.Email,
                Password: req.body.Password
            })
            await UserID.save()
            res.send(UserID)
        } catch (error) {
            res.send({
                apiStatus: false,
                message: error.message
            })
        }
    }
    static RemoveAccount = async(req, res) => {
        try {
            let DeleteAccount = await usermodel.findByIdAndDelete({
                _id: req.params.id
            })
        } catch (error) {
            res.send({
                apiStatus: false,
                message: error.message
            })
        }
    }
    static ShowRooms = async(req, res) => {
        try {
            let Show = await roommodel.find()
            res.send(Show)
        } catch (error) {
            res.send({
                apiStatus: false,
                message: error.message
            })
        }
    }
    static BookRoom = async(req, res) => {
        try {
            let finduser = await bookroommodel.findOne({
                userid: req.user._id
            })
            if (finduser == null) {
                let bookroom = await new bookroommodel({
                    userid: req.user._id,
                    roomsid: [{
                        roomid: req.body.roomid,
                        startDate: req.body.startDate,
                        endDate: req.body.endDate
                    }]
                }).populate({ path: "roomsid.roomid", strictPopulate: false })
                let roomstatus = await roommodel.findOne({
                    _id: req.body.roomid
                })
                for (let room of bookroom.roomsid) {
                    const diffTime = Math.abs(room.endDate - room.startDate);
                    room.nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    const date = new Date(room.startDate)
                    for (let i = 1; i <= room.nights; i++) {
                        for (let room of roomstatus.status) {
                            if (room == date.addDays(i)) {
                                throw new Error("Not Available")
                            }
                        }
                        roomstatus.status.push(date.addDays(i))
                    }
                }
                bookroom.totalprice = await Calculate(bookroom)
                await bookroom.save()
                await roomstatus.save()
                res.send(bookroom)
            } else {
                for (let room of finduser.roomsid) {
                    if (room.roomid == req.body.roomid) {
                        throw new Error("You have already reserved this room")
                    }
                }
                let roomstatus = await roommodel.findOne({
                    _id: req.body.roomid
                })
                if (roomstatus) {
                    finduser.roomsid.push({
                        roomid: req.body.roomid,
                        startDate: req.body.startDate,
                        endDate: req.body.endDate
                    })
                    await finduser.populate({ path: "roomsid.roomid", strictPopulate: false })
                    for (let room of finduser.roomsid) {
                        const diffTime = Math.abs(room.endDate - room.startDate);
                        room.nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                        const date = new Date(room.startDate)
                        for (let i = 1; i <= room.nights; i++) {
                            for (let room of roomstatus.status) {
                                if (room == date.addDays(i)) {
                                    throw new Error("Not Available")
                                }
                            }
                            roomstatus.status.push(date.addDays(i))
                        }
                        finduser.totalprice = await Calculate(finduser)
                    }
                }
                await finduser.save()
                await roomstatus.save()
                res.send(finduser)
            }
        } catch (error) {
            res.send({
                apiStatus: false,
                message: error.message
            })
        }
    }
    static ShowBookedRooms = async(req, res) => {
        try {
            let show = await bookroommodel.findOne({
                userid: req.user._id
            })
            res.send(show)
        } catch (error) {
            res.send({
                apiStatus: false,
                message: error.message
            })
        }
    }
    static CancelBookedRoom = async(req, res) => {
        try {
            let finduser = await bookroommodel.findOne({
                userid: req.user._id
            })
            if (finduser) {
                for (let room of finduser.roomsid) {
                    console.log(room.roomid)
                    console.log(req.params.id)
                    if (room.roomid == req.params.id) {
                        console.log("Done")
                        let index = finduser.roomsid.indexOf(room)
                        console.log(index)
                        await finduser.roomsid.splice(index, 1)
                        finduser.totalprice = await Calculate(finduser)
                    }
                }
            }
            await finduser.save()
            res.send(finduser)
        } catch (error) {
            res.send({
                apiStatus: false,
                message: error.message
            })
        }
    }

}
module.exports = UserControl