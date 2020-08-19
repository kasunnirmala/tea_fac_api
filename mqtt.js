
var mqtt = require('mqtt');
var DeviceDataModel=require('./model/deviceData');
const express = require('express');
var socket = require('./app');

console.log("MQTT Loaded");
client = mqtt.connect('mqtt://138.197.92.157:1883');
var moment = require('moment');

client.on('connect', function () {
    // console.log('mqtt connected ... ');
    client.subscribe('a6140451/g9440826/d0003745/PUB');
    client.subscribe('a6140451/g9440826/d0003746/PUB');
    client.subscribe('a6140451/g9440826/d0003747/PUB');

});


client.on('message',async function (topic, message) {
    var dto = {};
    var splitArr = message.toString().split(':');

    dto.node_id = splitArr[0].substring(1, splitArr[0].length);
    dto.top_humidity = parseFloat(splitArr[2].split("%")[0]);
    dto.bottom_humidity = parseFloat(splitArr[2].split("%")[1]);
    dto.top_temperature = parseFloat(splitArr[3].split("*C")[0]);
    dto.bottom_temperature = parseFloat(splitArr[3].split("*C")[1]);
    dto.timestamp = moment();
    dto.datetime = moment().format("YYYY-MM-DD, h:mm:ss a");
    dto.date = moment().format("YYYY-MM-DD");
    dto.time = moment().format("HH:mm:ss");
    

    const DeviceData = new DeviceDataModel({
        node_id: dto.node_id,
        top_humidity: dto.top_humidity,
        bottom_humidity: dto.bottom_humidity ,
        top_temperature: dto.top_temperature ,
        bottom_temperature: dto.bottom_temperature,
        timestamp: dto.timestamp ,
        datetime: dto.datetime,
        date: dto.date,
        time: dto.time 
    });


    try {
        const savedDeviceData =await DeviceData.save();
        console.log("savedDeviceData");
        require('./app').emit("ANANKETEANODE005", savedDeviceData);
        // io.emit('msg', "Connected New");
    } catch (error) {
        console.log(error.message);

    };


});
