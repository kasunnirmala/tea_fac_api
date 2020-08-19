const express = require('express');
const app = express();
var http = require('http').createServer(app);
require('./db');
const bodyParse = require('body-parser');
const cors = require('cors');

const io = require('socket.io')(http);
const DeviceDataRoute = require('./routes/deviceData');
const RefGraphRoute = require('./routes/refGraph');


app.use(cors());

app.use(bodyParse.json({ limit: '50mb', extended: true }));
app.use(bodyParse.urlencoded({ limit: '50mb', extended: true }));


app.use('/deviceData', DeviceDataRoute);
app.use('/refGraph', RefGraphRoute);

io.on('connection', (socket) => {
  console.log('USER CONNECTED ' + socket.client.conn.id);
  module.exports = socket;
  //  socket.emit('msg',"Connected");
});

http.listen(4444, () => {
  console.log('listening on *:4444');
});



require('./mqtt');