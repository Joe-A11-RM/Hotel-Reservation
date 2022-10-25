const express = require('express')
const router = express.Router()
const AdminController = require('../Controller/admin.control')
const AdminAuth = require('../Authentication/admin.auth')
const upload = require('../Helpers/helper')
router.post('/addadmin', AdminController.Addadmin)
router.get('/login', AdminController.Login)
router.get('/logout/:id', AdminAuth, AdminController.Logout)
router.post('/addroom', /*upload.fields([{ name: 'file', maxCount: 2 }])*/ upload.array('file'), AdminController.AddRoom)
router.delete('/deleteroom/:id', AdminController.DeleteRoom)
router.put('/updateroom/:id', AdminController.EditRoomInf)
router.get('/updateroomimage/:id/:filename', AdminController.EditRoomImage)

module.exports = router