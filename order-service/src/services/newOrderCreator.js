import orderModel from "../models/order.js";
import eventBus from "../messaging/eventBus.js";
import crypto from "crypto";

class NewOrderCreator {
  async createNewOrder(data) {
    if (!Array.isArray(data.items) || data.items.length === 0) {
      throw new Error("Order must have at least one item");
    }

    const orderCreated = orderModel.create({
      customerId: data.user,
      items: data.items,
      valeu: data.value
    });

    const event = {
      eventId: crypto.randomUUID(),
      eventType: "order.created",
      timestamp: new Date().toISOString(),
      correlationId: crypto.randomUUID(),
      data: {
        orderId: orderCreated.id,
        customerId: orderCreated.customerId,
        items: orderCreated.items,
        value: orderCreated.value
      },
    };

    await eventBus.publish("order.created", event);

    return {
      orderId: orderCreated.id,
      status: orderCreated.status,
      createdAt: orderCreated.createdAt,
    };
  }
}

export default new NewOrderCreator();
