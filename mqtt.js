
var mqtt = require('mqtt');
var DeviceDataModel = require('./model/deviceData');
const express = require('express');
var socket = require('./app');
const BatchModel = require('./model/batch');


console.log("MQTT Loaded");
client = mqtt.connect('mqtt://138.197.92.157:1883');
var moment = require('moment-timezone');

client.on('connect', function () {
    // console.log('mqtt connected ... ');
    // client.subscribe('a6140451/g9440826/d0003745/PUB');
    // client.subscribe('a6140451/g9440826/d0003746/PUB');
    // client.subscribe('a6140451/g9440826/d0003747/PUB');

    client.subscribe('a6140451/g9440826/d0003748/PUB');

});


client.on('message', async function (topic, message) {
    // console.log(message.toString());

    var dto = {};
    var splitArr = message.toString().split(':');

    dto.node_id = splitArr[0].substring(1, splitArr[0].length);
    dto.top_humidity = parseFloat(splitArr[2].split("%")[0]);
    dto.bottom_humidity = parseFloat(splitArr[2].split("%")[1]);
    dto.top_temperature = parseFloat(splitArr[3].split("*C")[0]);
    dto.bottom_temperature = parseFloat(splitArr[3].split("*C")[1]);
    dto.timestamp = moment().tz("Asia/Colombo");
    dto.datetime = moment().tz("Asia/Colombo").format("YYYY-MM-DD, h:mm:ss a");
    dto.date = moment().tz("Asia/Colombo").format("YYYY-MM-DD");
    dto.time = moment().tz("Asia/Colombo").format("HH:mm:ss");

    console.log("Temperature 1 : " + dto.top_temperature + "\t Humidity 1: " + dto.top_humidity + "\tBulb Differece 1 : " + calculateBulbDiff(dto.top_temperature, dto.top_humidity) + "\t\tTemperature 2 : " + dto.bottom_temperature + "\t Himidity 2: " + dto.bottom_humidity + "\tBulb Differece 1 : " + calculateBulbDiff(dto.bottom_temperature, dto.bottom_humidity));

    


    // try {
    //     var Batches = await BatchModel.findOne().sort({ _id: -1 });
    //     if (Batches && Batches.status) {
    //         const DeviceData = new DeviceDataModel({
    //             node_id: dto.node_id,
    //             batch_id: Batches.batch_id,
    //             top_humidity: dto.top_humidity,
    //             bottom_humidity: dto.bottom_humidity,
    //             top_temperature: dto.top_temperature,
    //             bottom_temperature: dto.bottom_temperature,
    //             timestamp: dto.timestamp,
    //             datetime: dto.datetime,
    //             date: dto.date,
    //             time: dto.time
    //         });




    //         const savedDeviceData = await DeviceData.save();
    //         console.log("savedDeviceData");
    //         require('./app').emit("ANANKETEANODE", savedDeviceData);
    //     }

    //     console.log(Batches);
    //     console.log("DATA RECIEVED");


    //     // io.emit('msg', "Connected New");
    // } catch (error) {
    //     console.log(error.message);

    // };


});


const calculateBulbDiff = (t, rh) => {
    wetBulb = t * Math.atan(0.151977 * Math.sqrt(rh + 8.313659)) + Math.atan(t + rh) - Math.atan(rh - 1.676331) + 0.00391838 * ((Math.sqrt(rh) ** 3)) * Math.atan(0.023101 * rh) - 4.686035;
    bulbDiff = t - wetBulb;
    return bulbDiff.toFixed(2);
}