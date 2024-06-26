const mongoose = require('mongoose')
const Schema = mongoose.Schema

const dataSchema = new Schema({
player: String,
level: String,
weight: Number,
chestFold: Number,
abdominalFold: Number,
thighFold: Number,
lbLimbLength: Number,
lateralBoundRight: Number,
lateralBoundLeft: Number,
broadJump: Number,
tbdlVelo135: Number,
tbdlVelo185: Number,
tbdlVelo225: Number,
tbdlVelo275: Number,
tbdlVelo315: Number,
tbdlVelo365: Number,
tbdlVelo405: Number,
tbdlVelo455: Number,
tenYardSprint: Number,
thirtyYardSprint: Number,
d2flexionRight: Number,
d2extensionRight: Number,
d2flexionLeft: Number,
d2extensionLeft: Number,
shoulderEr: Number,
shoulderIr: Number,
scaption: Number,
grip: Number,
tbdl1Rm: Number,
mbRotOhRight: Number,
mbRotOhLeft: Number,
mbScoopRight: Number,
mbScoopLeft: Number,
pressRight: Number,
pressLeft: Number,
rowRight: Number,
rowLeft: Number,
shotputPowerRight: Number,
shotputPowerLeft: Number,
shotputAccelRight: Number,
shotputAccelLeft: Number,
trunkRotPowerRight: Number,
trunkRotPowerLeft: Number,
trunkRotAccelRight: Number,
trunkRotAccelLeft: Number,
plyoRotPowerRight: Number,
plyoRotPowerLeft: Number,
plyoRotAccelRight: Number,
plyoRotAccelLeft: Number,
}, {timestamps: true})

module.exports = mongoose.model('Data', dataSchema )