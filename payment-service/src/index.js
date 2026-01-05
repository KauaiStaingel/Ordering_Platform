import eventBus from "./messaging/eventBus.js";
import orderCreatedConsumer from "./handler/orderCreatedConsumer.js";

async function bootstrap() {
  await eventBus.connect();

  await eventBus.consume("payments.process", "order.created", async (event) => {
    await orderCreatedConsumer.handle(event);
  });

  console.log("💳 Payment Service worker rodando. Aguardando order.created...");
}

bootstrap().catch((err) => {
  console.error("❌ Falha ao iniciar Payment Service:", err);
  process.exit(1);
});
