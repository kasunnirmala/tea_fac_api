
var mqtt = require('mqtt');
var DeviceDataModel = require('./model/deviceData');
const express = require('express');
var socket = require('./app');
const BatchModel = require('./model/batch');



var sensorMap = new Map();
sensorMap.set("ANANKETEANODE008", 2);
sensorMap.set("ANANKETEANODE009", 2);
sensorMap.set("ANANKETEANODE010", 2);
sensorMap.set("ANANKETEANODE011", 4);
sensorMap.set("ANANKETEANODE012", 4);
sensorMap.set("ANANKETEANODE013", 4);
sensorMap.set("ANANKETEANODE014", 5);
sensorMap.set("ANANKETEANODE015", 5);
sensorMap.set("ANANKETEANODE016", 5);
sensorMap.set("ANANKETEANODE017", 5);
sensorMap.set("ANANKETEANODE018", 5);
sensorMap.set("ANANKETEANODE019", 6);
sensorMap.set("ANANKETEANODE020", 6);
sensorMap.set("ANANKETEANODE021", 6);
sensorMap.set("ANANKETEANODE022", 6);
sensorMap.set("ANANKETEANODE023", 6);
sensorMap.set("ANANKETEANODE024", 1);
sensorMap.set("ANANKETEANODE025", 1);
sensorMap.set("ANANKETEANODE026", 1);
sensorMap.set("ANANKETEANODE027", 1);
sensorMap.set("ANANKETEANODE028", 1);




console.log("MQTT Loaded");
client = mqtt.connect('mqtt://138.197.92.157:1883');
var moment = require('moment-timezone');

client.on('connect', function () {
    // console.log('mqtt connected ... ');
    client.subscribe('a6140451/g9440826/d0003748/PUB');
    client.subscribe('a6140451/g9440826/d0003749/PUB');
    client.subscribe('a6140451/g9440826/d0003750/PUB');
    client.subscribe('a6140451/g9440826/d0003751/PUB');
    client.subscribe('a6140451/g9440826/d0003752/PUB');
    client.subscribe('a6140451/g9440826/d0003753/PUB');

    client.subscribe('a6140451/g9440826/d0003754/PUB');
    client.subscribe('a6140451/g9440826/d0003755/PUB');
    client.subscribe('a6140451/g9440826/d0003756/PUB');
    client.subscribe('a6140451/g9440826/d0003757/PUB');
    client.subscribe('a6140451/g9440826/d0003758/PUB');
    client.subscribe('a6140451/g9440826/d0003759/PUB');
    client.subscribe('a6140451/g9440826/d0003760/PUB');
    client.subscribe('a6140451/g9440826/d0003761/PUB');
    client.subscribe('a6140451/g9440826/d0003762/PUB');
    client.subscribe('a6140451/g9440826/d0003763/PUB');


    client.subscribe('a6140451/g9440826/d0003764/PUB');
    client.subscribe('a6140451/g9440826/d0003765/PUB');
    client.subscribe('a6140451/g9440826/d0003766/PUB');
    client.subscribe('a6140451/g9440826/d0003767/PUB');


});


client.on('message', async function (topic, message) {
    var dto = {};
    var splitArr = message.toString().split(':');

    dto.node_id = splitArr[0].substring(1, splitArr[0].length);
    dto.trough_id = sensorMap.get(splitArr[0].substring(1, splitArr[0].length));
    dto.top_humidity = parseFloat(splitArr[2].split("%")[0]);
    dto.bottom_humidity = parseFloat(splitArr[2].split("%")[1]);
    dto.top_temperature = parseFloat(splitArr[3].split("*C")[0]);
    dto.bottom_temperature = parseFloat(splitArr[3].split("*C")[1]);
    dto.top_humidity = dto.top_humidity == 0 ? dto.bottom_humidity == 0 ? 0 : dto.bottom_humidity : dto.top_humidity;
    dto.bottom_humidity = dto.top_humidity == 0 ? dto.bottom_humidity == 0 ? 0 : dto.bottom_humidity : dto.top_humidity;
    dto.top_temperature = dto.top_temperature == 0 ? dto.bottom_temperature == 0 ? 0 : dto.bottom_temperature : dto.top_temperature;
    dto.bottom_temperature = dto.top_temperature == 0 ? dto.bottom_temperature == 0 ? 0 : dto.bottom_temperature : dto.top_temperature;


    dto.timestamp = moment().tz("Asia/Colombo");
    dto.datetime = moment().tz("Asia/Colombo").format("YYYY-MM-DD, h:mm:ss a");
    dto.date = moment().tz("Asia/Colombo").format("YYYY-MM-DD");
    dto.time = moment().tz("Asia/Colombo").format("HH:mm:ss");
    dto.top_bulbdiff = calculateBulbDiff(dto.top_temperature, dto.top_humidity);
    dto.bottom_bulbdiff = calculateBulbDiff(dto.bottom_temperature, dto.bottom_humidity);
    //
    //console.log((dto.trough_id));
    //console.log(sensorMap);
    try {
        var Batches = await BatchModel.findOne().sort({ _id: -1 });
        if (Batches && Batches.status) {
            const DeviceData = new DeviceDataModel({
                node_id: dto.node_id,
                trough_id: dto.trough_id,
                batch_id: Batches.batch_id,
                top_humidity: dto.top_humidity,
                bottom_humidity: dto.top_humidity,
                top_temperature: dto.top_temperature,
                bottom_temperature: dto.top_temperature,
                timestamp: dto.timestamp,
                datetime: dto.datetime,
                date: dto.date,
                time: dto.time,
                top_bulbdiff: dto.top_bulbdiff,
                bottom_bulbdiff: dto.bottom_bulbdiff
            });




            const savedDeviceData = await DeviceData.save();
            console.log(savedDeviceData);
            require('./app').emit("ANANKETEANODE", savedDeviceData);
        }

        // console.log(Batches);
        // console.log("DATA RECIEVED");


        // io.emit('msg', "Connected New");
    } catch (error) {
        console.log(error.message);

    };


});



const calculateBulbDiff = (t, rh) => {
    wetBulb = t * Math.atan(0.151977 * Math.sqrt(rh + 8.313659)) + Math.atan(t + rh) - Math.atan(rh - 1.676331) + 0.00391838 * ((Math.sqrt(rh) ** 3)) * Math.atan(0.023101 * rh) - 4.686035;
    bulbDiff = t - wetBulb;
    return bulbDiff.toFixed(2);
}
