const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "clientID",
  brokers: ["kafka:9092"]
});
const consumer = kafka.consumer({ groupId: 'groupID' })

async function main() {
  await consumer.connect()
  await consumer.subscribe({ topic: 'accelerometer-data', fromBeginning: true })

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log("CONSUMER: MESSAGE RECEIVED");
      console.log(message.value.toString());
    },
  });
}

main();