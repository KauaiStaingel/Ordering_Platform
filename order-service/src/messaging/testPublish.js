import eventBus from "./eventBus.js";

async function testPublish() {
  try {
    const message = {
      test: true,
      message: "hello rabbitmq",
      timestamp: new Date().toISOString(),
    };

    await eventBus.publish("order.created", message);

    console.log("✅ Mensagem de teste publicada com sucesso");
    process.exit(0);
  } catch (error) {
    console.error("❌ Erro ao publicar mensagem de teste:", error);
    process.exit(1);
  }
}

testPublish();
