import orderModel from "../db/order.js";

class PaymentResultConsumer {
  async handle(event) {
    // validação mínima
    if (!event?.eventType || !event?.data?.orderId) {
      console.warn("⚠️ Evento inválido:", event);
      return;
    }

    const { orderId } = event.data;

    let newStatus = null;

    if (event.eventType === "payment.completed") newStatus = "PAID";
    if (event.eventType === "payment.failed") newStatus = "FAILED";

    if (!newStatus) {
      console.warn("⚠️ EventType ignorado:", event.eventType);
      return;
    }

    const updated = orderModel.updateStatus(orderId, newStatus);

    if (!updated) {
      console.warn(`⚠️ Pedido não encontrado para atualizar: ${orderId}`);
      return;
    }

    console.log(`🟢 Pedido atualizado: ${orderId} -> ${newStatus}`);
  }
}

export default new PaymentResultConsumer();
