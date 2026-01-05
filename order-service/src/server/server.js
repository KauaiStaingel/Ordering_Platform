import express from "express";
import cors from "cors";
import router from "../routes/routes.js";

import eventBus from "../messaging/eventBus.js";
import paymentResultConsumer from "../consumer/paymentResultConsumer.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use("/", router);

const PORT = 5000;
const HOST = "192.168.15.114";

// inicia os consumers do Order Service (payment.*)
async function startConsumers() {
  await eventBus.connect();

  // mesma fila com 2 bindings (payment.completed e payment.failed)
  await eventBus.consume("orders.status.updates", "payment.completed", async (event) => {
    await paymentResultConsumer.handle(event);
  });

  await eventBus.consume("orders.status.updates", "payment.failed", async (event) => {
    await paymentResultConsumer.handle(event);
  });

  console.log("📩 Consumer ativo: ouvindo payment.completed / payment.failed");
}

app
  .listen(PORT, HOST)
  .on("listening", async () => {
    console.log(`Servidor rodando em http://${HOST}:${PORT}`);

    try {
      await startConsumers();
    } catch (err) {
      console.error("❌ Erro ao iniciar consumers:", err);
      process.exit(1);
    }
  })
  .on("error", (err) => {
    console.error("Erro ao iniciar servidor:", err.message);
    process.exit(1);
  });
