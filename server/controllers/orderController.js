const pool = require("../config/db");
const {
  sendOrderConfirmation,
  sendTransactionFailed,
} = require("../utils/emailService");

const generateOrderNumber = () => {
  return (
    "ORD-" +
    Date.now().toString().slice(-6) +
    Math.random().toString(36).substr(2, 4).toUpperCase()
  );
};

const createOrder = async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const { productId, variantId, quantity, customerInfo, totalAmount } =
      req.body;

    // Generate unique order number
    const orderNumber = generateOrderNumber();

    // Create order
    const orderResult = await client.query(
      "INSERT INTO orders (order_number, product_id, variant_id, quantity, total_amount) VALUES ($1, $2, $3, $4, $5) RETURNING id",
      [orderNumber, productId, variantId, quantity, totalAmount]
    );

    const orderId = orderResult.rows[0].id;

    // Store customer information
    await client.query(
      "INSERT INTO customer_info (order_id, full_name, email, phone, address, city, state, zip_code) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
      [
        orderId,
        customerInfo.fullName,
        customerInfo.email,
        customerInfo.phone,
        customerInfo.address,
        customerInfo.city,
        customerInfo.state,
        customerInfo.zipCode,
      ]
    );

    // Update inventory
    if (variantId) {
      await client.query(
        "UPDATE variants SET stock = stock - $1 WHERE id = $2",
        [quantity, variantId]
      );
    }

    // Simulate transaction processing
    const transactionStatus = Math.random() < 0.8 ? "completed" : "failed";

    if (transactionStatus === "completed") {
      await client.query("UPDATE orders SET status = $1 WHERE id = $2", [
        "completed",
        orderId,
      ]);

      // Send confirmation email
      await sendOrderConfirmation({
        orderNumber,
        customerInfo,
        productInfo: {
          name: req.body.productName,
          quantity,
        },
        total: totalAmount,
      });

      await client.query("COMMIT");
      res.json({
        success: true,
        orderNumber,
        message: "Order placed successfully",
      });
    } else {
      await client.query("UPDATE orders SET status = $1 WHERE id = $2", [
        "failed",
        orderId,
      ]);

      // Send failure email
      await sendTransactionFailed({
        orderNumber,
        customerInfo,
      });

      await client.query("COMMIT");
      res.status(400).json({
        success: false,
        message: "Transaction failed. Please try again.",
      });
    }
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Error creating order" });
  } finally {
    client.release();
  }
};

const getOrderByNumber = async (req, res) => {
  try {
    const { orderNumber } = req.params;

    const result = await pool.query(
      `SELECT o.*, p.name as product_name, p.price as product_price,
              v.name as variant_name, v.value as variant_value,
              ci.full_name, ci.email, ci.phone, ci.address, ci.city, ci.state, ci.zip_code
       FROM orders o
       JOIN products p ON o.product_id = p.id
       LEFT JOIN variants v ON o.variant_id = v.id
       JOIN customer_info ci ON o.id = ci.order_id
       WHERE o.order_number = $1`,
      [orderNumber]
    );

    const orders = result.rows;

    if (orders.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Parse numeric values
    const order = {
      ...orders[0],
      total_amount: parseFloat(orders[0].total_amount),
      product_price: parseFloat(orders[0].product_price),
      quantity: parseInt(orders[0].quantity),
    };

    res.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: "Error fetching order" });
  }
};

module.exports = {
  createOrder,
  getOrderByNumber,
};
