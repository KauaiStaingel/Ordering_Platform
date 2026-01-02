import orderModel from "../models/order.js";
import eventBus from "../messaging/eventBus.js";
import crypto from "crypto";

class getOrder {
  async getOrder(id) {

    const order = orderModel.findById(id);

    return order;
  }
}

export default new getOrder();
