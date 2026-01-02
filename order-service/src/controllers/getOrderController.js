import getOrder from "../services/getOrder.js";

class getOrderController {
  async newOrder(req, res) {
    const body = req.body;

    if (!body.userId || !body.id) {
      return res.status(400).send({
        error: "Payload inválido. Informe userId e id.",
      });
    }


    try {
      const order = await getOrder.createNewOrder(body.id);

      return res.status(201).send(order);
    } catch (err) {
      return res.status(500).send({
        error: "Erro ao encontrar pedido.",
      });
    }
  }
}

export default new getOrderController();
