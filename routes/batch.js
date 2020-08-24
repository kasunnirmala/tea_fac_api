const express = require('express');
const router = express.Router();
const BatchModel = require('../model/batch');
var moment = require('moment-timezone');

router.get('/getAll', async (req, res) => {
    try {
        var Batches = await BatchModel.find();
        res.json(Batches);
    } catch (error) {
        res.json({ message: error.message });
    }

})


router.get('/getLastBatch', async (req, res) => {
    try {
        var Batches = await BatchModel.findOne().sort({ _id: -1 });
        res.json(Batches);
    } catch (error) {
        res.json({ message: error.message });
    }

})

router.get('/getLastBatchID', async (req, res) => {
    try {
        var Batches = await BatchModel.findOne().sort({ _id: -1 });
        res.json(Batches?Batches.batch_id:null);
    } catch (error) {
        res.json({ message: error.message });
    }

})


router.post('/add', async (req, res) => {
    console.log("Add new");
    try {
        const Batches = new BatchModel({
            batch_id: req.body.batch_id,
            status: true,
            start_time: moment().tz("Asia/Colombo").format("YYYY-MM-dd HH:mm:ss")
        });

        const savedBatches = await Batches.save();
        res.json(savedBatches);
    } catch (error) {
        res.json({ message: error.message });
    }

});


router.post('/update', async (req, res) => {
    console.log("Updated");
    try {
        var updatedBatch = await BatchModel.updateOne(
            { batch_id: req.body.batch_id },
            {
                $set: {
                    status: false,
                    stop_time: moment().tz("Asia/Colombo").format("YYYY-MM-dd HH:mm:ss"),
                }
            });
        res.json(updatedBatch);
    } catch (error) {
        res.json({ message: error.message });
    }

});


module.exports = router;