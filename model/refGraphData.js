const mongoose = require('mongoose');
var ObjectIdSchema = mongoose.Schema.ObjectId;
var ObjectId = mongoose.Types.ObjectId;

const RefGraphSchema = new mongoose.Schema({
    _id: { type: ObjectIdSchema, default: function () { return new ObjectId() } },
    dataSet: [],
    troughId: String,
}, {
    timestamps: true
});


module.exports = mongoose.model('refGraph', RefGraphSchema);