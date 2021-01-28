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


router.get('/getWithering/:nodeID/:date', async (req, res) => {

    var end = moment(req.params.date + " 8:00:00 am").valueOf();
    var start = moment(moment(req.params.date).add(-1, 'day').format("YYYY-MM-DD").toString() + " 6:00:00 pm").valueOf();

    // res.json({end:end,start:start});




    try {
        var DeviceData = await DeviceDataModel.find({ node_id: req.params.nodeID, $and: [{ timestamp: { $lte: parseInt(end) } }, { timestamp: { $gte: parseInt(start) } }] });
        res.json(DeviceData);
    } catch (error) {
        res.json({ message: error.message });
    }

})



router.get('/getWitheringWithTroughID/:date/:trough', async (req, res) => {
    // 1605282411209
    var date = req.params.date;
    var trough=req.params.trough;
    // var date ="2020-11-15";

//     var m = moment(date).utcOffset(0);
// m.set({hour:0,minute:0,second:0,millisecond:0})
// m.toISOString()
// m.format()

var dateMoment = moment(date).tz("Asia/Colombo");
dateMoment.set({hour:8,minute:0,second:0,millisecond:0})
var startDateMoment= moment(date).subtract(1, 'days').tz("Asia/Colombo");
startDateMoment.set({hour:18,minute:0,second:0,millisecond:0})
var end=dateMoment.unix()*1000;
var start=startDateMoment.unix()*1000;

    try {
       
        var DeviceData = await DeviceDataModel.aggregate([{
                    '$match': {
                    '$and': [
                        {
                            'timestamp': {
                                '$lte': parseInt(end)
                            }
                        }, {
                            'timestamp': {
                                '$gte': parseInt(start)
                            }
                        }, {
                            'trough_id': parseInt(trough)
                        }
                    ]
                }
        },
            {
                '$group': {
                  '_id': '$node_id', 
                  'trough_id': {
                    '$first': '$trough_id'
                  }, 
                  'data': {
                    '$push': '$$ROOT'
                  }
                }
              }, {
                '$sort': {
                  '_id': 1
                }
              }
    
    ]);
      
        // console.log(DeviceData);
        //        res.json({count:DeviceData[1].data.length,name:DeviceData[1].data[1].node_id});
        res.json(DeviceData);
    } catch (error) {

        res.json({ message: error.message });
    }

})





router.get('/getWitheringAllArray/:date', async (req, res) => {

    var date = req.params.date;
    // var date ="2020-12-15";
    // var end = moment(date + " 8:00:00 am").valueOf();
    // var start = moment(moment(date).add(-1, 'day').format("YYYY-MM-DD").toString() + " 6:00:00 pm").valueOf();


    var end = moment().valueOf();
    var start = moment().add(-1, 'hour').valueOf();


    // res.json({end:end,start:start});



    try {
        // var DeviceData = await DeviceDataModel.find({ node_id: req.params.nodeID, $and: [{ timestamp: { $lte: parseInt(end) } }, { timestamp: { $gte: parseInt(start) } }] });
        var DeviceData = await DeviceDataModel.aggregate([
            {
                '$match': {
                    '$and': [
                        {
                            'timestamp': {
                                '$lte': parseInt(end)
                            }
                        }, {
                            'timestamp': {
                                '$gte': parseInt(start)
                            }
                        }, {
                            'node_id': { $ne: "ANANKETEANODE009" }
                        }
                    ]
                }
            }, {
                '$group': {
                    '_id': '$node_id',
                    'data': {
                        '$push': {
                            '_id': '$_id',
                            'node_id': '$node_id',
                            'batch_id': '$batch_id',
                            'top_humidity': '$top_humidity',
                            'bottom_humidity': '$bottom_humidity',
                            'top_temperature': '$top_temperature',
                            'bottom_temperature': '$bottom_temperature',
                            'timestamp': '$timestamp',
                            'datetime': '$datetime',
                            'date': '$date',
                            'time': '$time',
                            'top_bulbdiff': '$top_bulbdiff',
                            'bottom_bulbdiff': '$bottom_bulbdiff',
                            'createdAt': '$createdAt',
                            'updatedAt': '$updatedAt'
                        }
                    }
                }
            }, {
                '$sort': {
                    '_id': 1
                }
            }
        ]);
        //        res.json({count:DeviceData[1].data.length,name:DeviceData[1].data[1].node_id});
        res.json(DeviceData);
    } catch (error) {
        res.json({ message: error.message });
    }

})



router.get('/getWitheringAllArrayGroupByTrough', async (req, res) => {


    var end = moment().valueOf();
    var start = moment().add(-1, 'hour').valueOf();


    try {
       var DeviceData = await DeviceDataModel.aggregate([
            {
                '$match': {
                    '$and': [
                        {
                            'timestamp': {
                                '$lte': parseInt(end)
                            }
                        }, {
                            'timestamp': {
                                '$gte': parseInt(start)
                            }
                        }, 
                    ]
                }
            }, 
            
            {
                '$group': {
                  '_id': '$node_id', 
                  'trough_id': {
                    '$first': '$trough_id'
                  }, 
                  'data': {
                    '$push': '$$ROOT'
                  }
                }
              }, {
                '$group': {
                  '_id': '$trough_id', 
                  'data': {
                    '$push': '$$ROOT'
                  }
                }
              }, {
                '$sort': {
                  '_id': 1
                }
              }
        ]);
        //        res.json({count:DeviceData[1].data.length,name:DeviceData[1].data[1].node_id});
        res.json(DeviceData);
    } catch (error) {
        res.json({ message: error.message });
    }

})



router.get('/getAllAverageDifference/:date', async (req, res) => {

    var date = req.params.date;
    // var date ="2020-12-15";
    try {
        var DeviceData = await DeviceDataModel.aggregate([
            {
                '$match': {
                    'date': req.params.date
                }
            }, {
                '$addFields': {
                    'hour': {
                        '$substr': [
                            '$time', 0, 2
                        ]
                    }
                }
            }, {
                '$group': {
                    '_id': {
                        'trough_id': '$trough_id',
                        'hour': '$hour'
                    },
                    'node_id': {
                        '$first': '$node_id'
                    },
                    'trough_id': {
                        '$first': '$trough_id'
                    },
                    'top_humidity': {
                        '$avg': '$top_humidity'
                    },
                    'bottom_humidity': {
                        '$avg': '$bottom_humidity'
                    },
                    'top_temperature': {
                        '$avg': '$top_temperature'
                    },
                    'bottom_temperature': {
                        '$avg': '$bottom_temperature'
                    },
                    'top_bulbdiff': {
                        '$avg': '$top_bulbdiff'
                    },
                    'bottom_bulbdiff': {
                        '$avg': '$bottom_bulbdiff'
                    }
                }
            }, {
                '$sort': {
                    '_id.hour': 1
                }
            }, {
                '$group': {
                    '_id': '$trough_id',
                    'trough_id': {
                        '$first': '$trough_id'
                    },
                    'data': {
                        '$push': {
                            'hour': '$_id.hour',
                            'top_humidity': '$top_humidity',
                            'trough_id': '$trough_id',
                            'bottom_humidity': '$bottom_humidity',
                            'top_temperature': '$top_temperature',
                            'bottom_temperature': '$bottom_temperature',
                            'top_bulbdiff': '$top_bulbdiff',
                            'bottom_bulbdiff': '$bottom_bulbdiff'
                        }
                    }
                }
            }, {
                '$sort': {
                    '_id': 1
                }
            }
        ]);
        res.json(DeviceData);
    } catch (error) {
        res.json({ message: error.message });
    }

})


router.get('/getLastSensorRaw/:date', async (req, res) => {
    var date = req.params.date;
    try {
        var DeviceData = await DeviceDataModel.aggregate([
            {
                '$match': {
                    'date': date,
                    "node_id": { $ne: "ANANKETEANODE012" } 
                }
            }, {
                '$sort': {
                    'timestamp': 1
                }
            }, {
                '$group': {
                    '_id': '$node_id',
                    'trough_id': {
                        '$first': '$trough_id'
                    },
                    'data': {
                        '$last': '$$ROOT'
                    }
                }
            }, {
                '$group': {
                    '_id': '$trough_id',
                    'data': {
                        '$push': '$data'
                    }
                }
            }, {
                '$sort': {
                    '_id': 1
                }
            }
        ]);
        res.json(DeviceData);
    } catch (error) {
        res.json({ message: error.message });
    }

})


router.get('/getCurrentDiffAvg', async (req, res) => {

    try {
        var DeviceData = await DeviceDataModel.aggregate([
            {
                '$group': {
                  '_id': '$node_id', 
                  'trough_id': {
                    '$first': '$trough_id'
                  }, 
                  'timestamp': {
                    '$first': '$timestamp'
                  }, 
                  'bulbdiff': {
                    '$first': '$top_bulbdiff'
                  }
                }
              }, {
                '$group': {
                  '_id': '$trough_id', 
                  'data': {
                    '$push': '$$ROOT'
                  }, 
                  'avg_bulb_diff': {
                    '$avg': '$bulbdiff'
                  }
                }
              }, {
                '$sort': {
                  '_id': 1
                }
              }
        ]);
        res.json(DeviceData);
    } catch (error) {
        res.json({ message: error.message });
    }

})



module.exports = router;
