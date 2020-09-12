const express = require('express');
const router = express.Router();
const DeviceDataModel = require('../model/deviceData');
var moment = require('moment-timezone');

router.get('/byDateAndID/:nodeID/:date', async (req, res) => {
    try {
        var DeviceData = await DeviceDataModel.find({ node_id: req.params.nodeID, date: req.params.date });
        res.json(DeviceData);
    } catch (error) {
        res.json({ message: error.message });
    }

})

router.get('/byBatchAndID/:nodeID/:batch_id', async (req, res) => {
    try {
        var DeviceData = await DeviceDataModel.find({ node_id: req.params.nodeID, batch_id: req.params.batch_id });
        res.json(DeviceData);
    } catch (error) {
        res.json({ message: error.message });
    }

})


router.get('/getWithering/:date', async (req, res) => {;
    var end = moment(req.params.date + " 8:00:00 am").valueOf();
    var start = moment(moment(req.params.date).add(-1, 'day').format("YYYY-MM-DD").toString()+" 6:00:00 pm").valueOf();
   
   // res.json({end:end,start:start});




    try {
        var DeviceData = await DeviceDataModel.find({ $and: [{ timestamp: { $lte: parseInt(end) } }, { timestamp: { $gte: parseInt(start) } }] });
        res.json(DeviceData);
    } catch (error) {
        res.json({ message: error.message });
    }

})

module.exports = router;