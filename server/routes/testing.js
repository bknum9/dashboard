const express = require('express')
const {getUsers, 
    getOneUser, 
    createUser, 
    getUserData,
    getOneUserData,
    createUserData,
    getLevelData
} = require('../controller/inputController')
const router = express.Router()

//GET all users
router.get('/users', getUsers)

//GET one user
router.get('/user/:id', getOneUser)

//post new user
router.post('/user', createUser)

//post new data
router.post('/data', createUserData)

//GET all users
router.get('/data', getUserData)

//GET one user data
router.get('/data/:player', getOneUserData)

//GET one user data
router.get('/info/:level', getLevelData)

module.exports = router