import crypto from "crypto";
import pool from "./pg.js";

function normalizeItems(items) {
  let it = items;

  if (typeof it === "string") it = JSON.parse(it);

  if (Array.isArray(it)) {
    it = it.map((x) => (typeof x === "string" ? JSON.parse(x) : x));
  }

  if (it && typeof it === "object" && !Array.isArray(it)) {
    it = [it];
  }

  if (!Array.isArray(it)) {
    throw new Error("items inválido: envie um array (ex: [{ productId, quantity }]).");
  }

  return it;
}

class OrderModel {
  async create({ customerId, items, value }) {
    if (value === undefined || value === null) {
      throw new Error("value é obrigatório.");
    }

    const parsedItems = normalizeItems(items);
    const itemsJson = JSON.stringify(parsedItems);

    const orderId = crypto.randomUUID();
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      // 1) Insere o pedido
      await client.query(
        `
        INSERT INTO orders (id, customer_id, items, value)
        VALUES ($1, $2, $3::jsonb, $4)
        `,
        [orderId, customerId, itemsJson, value]
      );

      // 2) Insere status inicial
      await client.query(
        `
        INSERT INTO orders_status (order_id, status)
        VALUES ($1, $2)
        `,
        [orderId, "CREATED"]
      );

      // 3) Busca pela VIEW (status mais recente)
      const viewResult = await client.query(
        `
        SELECT *
        FROM get_order
        WHERE id = $1
        `,
        [orderId]
      );

      await client.query("COMMIT");

      const o = viewResult.rows[0];

      // retorno padronizado pro resto do app
      return {
        id: o.id,
        customerId: o.customer_id ?? o.customerid ?? customerId, // fallback
        items: o.items,
        value: o.value,
        status: o.status,
        createdAt: o.data_pedido,
      };
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }

  async findById(orderId) {
    const result = await pool.query(
      `
      SELECT *
      FROM get_order
      WHERE id = $1
      `,
      [orderId]
    );
    return result.rows[0] || null;
  }

  async updateStatus(orderId, status) {
    const result = await pool.query(
      `
      INSERT INTO orders_status (order_id, status)
      VALUES ($1, $2)
      RETURNING id, order_id, status, created_at
      `,
      [orderId, status]
    );
    return result.rows[0];
  }

  async findAll() {
    const result = await pool.query(`
      SELECT *
      FROM get_order
      ORDER BY data_pedido DESC
    `);
    return result.rows;
  }
}

export default new OrderModel();
