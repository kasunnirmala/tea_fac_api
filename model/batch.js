const mongoose = require('mongoose');
var ObjectIdSchema = mongoose.Schema.ObjectId;
var ObjectId = mongoose.Types.ObjectId;

const BatchSchema = new mongoose.Schema({
    _id: { type: ObjectIdSchema, default: function () { return new ObjectId() } },
    batch_id: String,
    status: Boolean,
    start_time: String,
    stop_time: String,
}, {
    timestamps: true
});


module.exports = mongoose.model('batch', BatchSchema);