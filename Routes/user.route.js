const express = require('express')
const router = express.Router()
const UserAuth = require('../Authentication/user.auth')
const UserController = require('../Controller/user.control')
router.post('/signup', UserController.SignUP)
router.get('/login', UserController.Login)
router.get('/logout/:id', UserAuth, UserController.Logout)
router.get('/updatedata/:id', UserController.UpdatePersonalData)
router.get('/deleteaccount/:id', UserController.RemoveAccount)
router.get('/showrooms', UserController.ShowRooms)
router.post('/bookroom', UserAuth, UserController.BookRoom)
router.get('/showbookedroom', UserAuth, UserController.ShowBookedRooms)

module.exports = router