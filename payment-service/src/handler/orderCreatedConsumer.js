import crypto from "crypto";
import eventBus from "../messaging/eventBus.js";
import paymentProcessor from "../services/paymentProcessor.js";

class OrderCreatedConsumer {
  async handle(event) {
    // validação mínima (MVP)
    if (!event || event.eventType !== "order.created" || !event.data?.orderId) {
      console.warn("⚠️ Evento inválido recebido:", event);
      return; // não lança erro pra não travar fila
    }

    const result = await paymentProcessor.process(event.data);

    const outEvent = {
      eventId: crypto.randomUUID(),
      eventType: result.status === "PAID" ? "payment.completed" : "payment.failed",
      timestamp: new Date().toISOString(),
      correlationId: event.correlationId || crypto.randomUUID(),
      data: {
        orderId: event.data.orderId,
        transactionId: result.transactionId,
        status: result.status,
        reason: result.reason,
      },
    };

    const routingKey =
      result.status === "PAID" ? "payment.completed" : "payment.failed";

    await eventBus.publish(routingKey, outEvent);

    console.log(
      `✅ Pagamento processado: orderId=${event.data.orderId} -> ${result.status}`
    );
  }
}

export default new OrderCreatedConsumer();
