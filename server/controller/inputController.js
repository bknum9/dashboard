const mongoose = require('mongoose')
const User = require('../models/userModel')
const Data = require('../models/dataModel')

//GET all users
const getUsers = async (req, res) => {
   const users = await User.find({}).sort({name:1})
   res.status(200).json(users)
}

//GET one user
const getOneUser = async (req, res) => {
    const { id } = req.params 
if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'No such user exists'})
}
    const user = await User.findById(id)
    if (!user) {
        return res.status(404).json({error: 'No such user exists'})
    }
    res.status(200).json(user)
}

//post new user
const createUser = async (req, res) => {
    const {name, position, schoolOrg, age, level} = req.body
        try {
            const user = await User.create({name, position, schoolOrg, age, level})
            res.status(200).json(user)
        }
        catch (error) {
            res.status(400).json({error: error.message})
        }
}

  //post new data
const createUserData =  async (req, res) => {
    const {player,
        level,
        weight,
        chestFold,
        abdominalFold,
        thighFold,
        lbLimbLength,
        lateralBoundRight,
        lateralBoundLeft,
        broadJump,
        tbdlVelo135,
        tbdlVelo185,
        tbdlVelo225,
        tbdlVelo275,
        tbdlVelo315,
        tbdlVelo365,
        tbdlVelo405,
        tbdlVelo455,
        tenYardSprint,
        thirtyYardSprint,
        d2flexionRight,
        d2extensionRight,
        d2flexionLeft,
        d2extensionLeft,
        shoulderEr,
        shoulderIr,
        scaption,
        grip,
        tbdl1Rm,
        mbRotOhRight,
        mbRotOhLeft,
        mbScoopRight,
        mbScoopLeft,
        pressRight,
        pressLeft,
        rowRight,
        rowLeft,
        shotputPowerRight,
        shotputPowerLeft,
        shotputAccelRight,
        shotputAccelLeft,
        trunkRotPowerRight,
        trunkRotPowerLeft,
        trunkRotAccelRight,
        trunkRotAccelLeft,
        plyoRotPowerRight,
        plyoRotPowerLeft,
        plyoRotAccelRight,
        plyoRotAccelLeft
    } = req.body
    try {
        const userData = await Data.create({
            player,
        level,
        weight,
        chestFold,
        abdominalFold,
        thighFold,
        lbLimbLength,
        lateralBoundRight,
        lateralBoundLeft,
        broadJump,
        tbdlVelo135,
        tbdlVelo185,
        tbdlVelo225,
        tbdlVelo275,
        tbdlVelo315,
        tbdlVelo365,
        tbdlVelo405,
        tbdlVelo455,
        tenYardSprint,
        thirtyYardSprint,
        d2flexionRight,
        d2extensionRight,
        d2flexionLeft,
        d2extensionLeft,
        shoulderEr,
        shoulderIr,
        scaption,
        grip,
        tbdl1Rm,
        mbRotOhRight,
        mbRotOhLeft,
        mbScoopRight,
        mbScoopLeft,
        pressRight,
        pressLeft,
        rowRight,
        rowLeft,
        shotputPowerRight,
        shotputPowerLeft,
        shotputAccelRight,
        shotputAccelLeft,
        trunkRotPowerRight,
        trunkRotPowerLeft,
        trunkRotAccelRight,
        trunkRotAccelLeft,
        plyoRotPowerRight,
        plyoRotPowerLeft,
        plyoRotAccelRight,
        plyoRotAccelLeft
        
        })
        res.status(200).json(userData)
    }
    catch (error) {
        res.status(400).json({error: error.message})
    }
}
//GET all user data
const getUserData = async (req, res) => {
    const usersData = await Data.find({}).sort({player: -1})
    res.status(200).json(usersData)
 }

 //GET one user data
const getOneUserData = async (req, res) => {
    try {
      const playerName = req.params.player.replace('%20', ' ');
      const oneUserdata = await Data.find({ player: playerName });
      const idArray = oneUserdata.map(doc => doc._id);
      const dataArray = oneUserdata.map(doc => doc.toJSON());
      res.json({idArray, dataArray});
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server Error' });
    }
  }

  //GET level data
const getLevelData = async (req, res) => {
    try {
      const playerLevel = req.params.level.replace('%20', ' ');
      const playerLevelData = await Data.find({ level: playerLevel });
      const levelIdArray = playerLevelData.map(doc => doc._id);
      const levelDataArray = playerLevelData.map(doc => doc.toJSON());
      res.json({levelIdArray, levelDataArray});
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server Error' });
    }
  }

module.exports = {
    getUsers,
    getOneUser,
    createUser,
    createUserData,
    getUserData,
    getOneUserData,
    getLevelData
}