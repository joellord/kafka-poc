const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const { Kafka } = require("kafkajs");

const PORT = process.env.PORT || 3000;
const kafka = new Kafka({
  clientId: "clientID",
  brokers: ["kafka:9092"]
});
const producer = kafka.producer();
app.use(express.static('public'));

io.on('connection', (socket) => {
  socket.on("orientation", async data => {
    console.log("Message Received on Websocket, sending to Kafka");
    await producer.connect();
    let message = {
      value: JSON.stringify({
        msg: "Data from NodeJS",
        data
      })
    };
    await producer.send({
      topic: "accelerometer-data",
      messages: [ message ]
    });
    await producer.disconnect();
  });
});

http.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});