import crypto from "crypto";

class OrderModel {
  constructor() {
    this.orders = new Map();
  }

  create({ customerId, items }) {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    const order = {
      id,
      customerId,
      items,
      status: "CREATED",
      createdAt: now,
      updatedAt: now,
    };

    this.orders.set(id, order);

    return order;
  }

  findById(orderId) {
    return this.orders.get(orderId) || null;
  }

  updateStatus(orderId, status) {
    const order = this.orders.get(orderId);

    if (!order) return null;

    order.status = status;
    order.updatedAt = new Date().toISOString();

    this.orders.set(orderId, order);

    return order;
  }

  findAll() {
    return Array.from(this.orders.values());
  }
}

export default new OrderModel();
