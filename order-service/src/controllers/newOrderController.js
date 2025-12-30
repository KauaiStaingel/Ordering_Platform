import newOrderCreator from "../services/newOrderCreator.js";

class newOrderController {
  async newOrder(req, res) {
    const body = req.body;

    const itemsIsInvalid =
      !Array.isArray(body.items) || body.items.length === 0;

    if (!body.userId || itemsIsInvalid) {
      return res.code(400).send({
        error: "Payload inválido. Informe userId e items (array não vazio).",
      });
    }

    const data = {
      user: body.userId,
      items: body.items,
      value: body.value
    };

    try {
      const createdOrder = await newOrderCreator.createNewOrder(data);

      return res.code(201).send(createdOrder);
    } catch (err) {
      return res.code(500).send({
        error: "Erro ao criar pedido.",
      });
    }
  }
}

export default new newOrderController();
