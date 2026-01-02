import crypto from "crypto";

class PaymentProcessor {
  async process(orderData) {
    // Simulação 80% sucesso / 20% falha
    const approved = Math.random() < 0.8;

    const transactionId = crypto.randomUUID();

    if (approved) {
      return {
        status: "PAID",
        transactionId,
        reason: null,
      };
    }

    return {
      status: "FAILED",
      transactionId,
      reason: "Pagamento recusado pelo provedor",
    };
  }
}

export default new PaymentProcessor();
