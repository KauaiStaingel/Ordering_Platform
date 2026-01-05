import amqp from "amqplib";

class EventBus {
  constructor() {
    this.connection = null;
    this.channel = null;
    this.exchange = "orders.events";
  }

  async connect() {
    if (this.connection && this.channel) { //opens the connection and create a channel
      return;
    }

    this.connection = await amqp.connect("amqp://localhost:5672");
    this.channel = await this.connection.createConfirmChannel();

    await this.channel.assertExchange(this.exchange, "topic", {
      durable: true,
    });
  }

  async publish(routingKey, message, options = {}) {
  if (!this.channel) {
    await this.connect();
  }

  const payload = Buffer.from(JSON.stringify(message));

  return new Promise((resolve, reject) => {
    this.channel.publish(
      this.exchange,
      routingKey,
      payload,
      {
        persistent: true,
        contentType: "application/json",
        ...options,
      },
      (err, ok) => {
        if (err) return reject(err);
        resolve(ok);
      }
    );
  });
}

async consume(queueName, routingKey, handler) {
  if (!this.channel) await this.connect();

  await this.channel.assertQueue(queueName, { durable: true });
  await this.channel.bindQueue(queueName, this.exchange, routingKey);

  await this.channel.consume(queueName, async (msg) => {
    if (!msg) return;

    try {
      const raw = msg.content.toString("utf-8");
      const event = JSON.parse(raw);

      await handler(event, msg);

      this.channel.ack(msg);
    } catch (err) {
      console.error("❌ Erro ao processar mensagem:", err);
      this.channel.nack(msg, false, true); // requeue
    }
  });
}


}

export default new EventBus();
