const express = require('express');
const router = express.Router();
const refGraphModel = require('../model/refGraphData');
var moment = require('moment');


router.get('/getAll', async (req, res) => {
    try {
        var RefGraph = await refGraphModel.find();
        res.json(RefGraph);
    } catch (error) {
        res.json({ message: error.message });
    }

});


router.get('/byID/:refGraphID', async (req, res) => {
    try {
        var RefGraph = await refGraphModel.findById(req.params.refGraphID);
        res.json(RefGraph);
    } catch (error) {
        res.json({ message: error.message });
    }

})

router.get('/byTrough/:troughId', async (req, res) => {
    try {
        var RefGraph = await refGraphModel.findOne({ "troughId": req.params.troughId });
        res.json(RefGraph);
    } catch (error) {
        res.json({ message: error.message });
    }

})



router.post('/add', async (req, res) => {




    try {
        var RefGraph = await refGraphModel.findOne({"troughId":req.body.troughId});
        if (RefGraph) {
            console.log("Update");
            var updatedRefGraph = await refGraphModel.updateOne(
                { _id: RefGraph._id },
                {
                    $set: {
                        dataSet: req.body.dataSet,
                        troughId: req.body.troughId,
                    }
                });
            res.json(updatedRefGraph);
        } else {
            console.log("Add new");
            const RefGraph = new refGraphModel({
                dataSet: req.body.dataSet,
                troughId: req.body.troughId,
            });

            const savedRefGraph = await RefGraph.save();
            res.json(savedRefGraph);
        }

    } catch (error) {
        res.json({ message: error.message });
    }





});




// router.post('/update/:refGraphID', async (req, res) => {
//     console.log("UPDATING");
//     // console.log(req.body.active);
//     try {
//         var updatedRefGraph = await refGraphModel.updateOne(
//             { _id: req.params.refGraphID },
//             {
//                 $set: {
//                     dataSet: req.body.dataSet,
//                     troughId: req.body.troughId,
//                 }
//             });
//         // console.log(updatedPost);
//         res.json(updatedRefGraph);
//     } catch (err) {
//         // console.log(err.message);
//         res.json({ message: err.message });

//     };
// });




module.exports = router;