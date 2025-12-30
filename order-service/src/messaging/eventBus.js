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

}

export default new EventBus();
