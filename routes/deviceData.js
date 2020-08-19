const express = require('express');
const router = express.Router();
const DeviceDataModel = require('../model/deviceData');
var moment = require('moment');

router.get('/byDateAndID/:nodeID/:date', async (req, res) => {
    try {
        var DeviceData = await DeviceDataModel.find({ node_id: req.params.nodeID, date: req.params.date });
        res.json(DeviceData);
    } catch (error) {
        res.json({ message: error.message });
    }

})

module.exports = router;