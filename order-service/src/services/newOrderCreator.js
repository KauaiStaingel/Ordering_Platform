import orderModel from "../models/order.js";

class NewOrderCreator {
  async createNewOrder(data) {
    if (!data.items || data.items.length === 0) {
      throw new Error("Order must have at least one item");
    }

    const orderCreated = orderModel.create({
      customerId: data.user,
      items: data.items,
    });

    return {
      orderId: orderCreated.id,
      status: orderCreated.status,
      createdAt: orderCreated.createdAt,
    };
  }
}

export default new NewOrderCreator();
