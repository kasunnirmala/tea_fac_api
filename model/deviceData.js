const mongoose = require('mongoose');
var ObjectIdSchema = mongoose.Schema.ObjectId;
var ObjectId = mongoose.Types.ObjectId;

const DeviceDataSchema = new mongoose.Schema({
    _id: { type: ObjectIdSchema, default: function () { return new ObjectId() } },
    node_id: String,
    top_humidity:Number,
    bottom_humidity: Number,
    top_temperature: Number,
    bottom_temperature : Number,
    timestamp: Number,
    datetime: String,
    date: String,
    time:String
}, {
    timestamps: true
});


module.exports = mongoose.model('deviceData', DeviceDataSchema);