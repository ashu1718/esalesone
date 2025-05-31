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
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const { productId, variantId, quantity, customerInfo, totalAmount } =
      req.body;

    // Generate unique order number
    const orderNumber = generateOrderNumber();

    // Create order
    const [orderResult] = await connection.query(
      "INSERT INTO orders (order_number, product_id, variant_id, quantity, total_amount) VALUES (?, ?, ?, ?, ?)",
      [orderNumber, productId, variantId, quantity, totalAmount]
    );

    const orderId = orderResult.insertId;

    // Store customer information
    await connection.query(
      "INSERT INTO customer_info (order_id, full_name, email, phone, address, city, state, zip_code) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
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
      await connection.query(
        "UPDATE variants SET stock = stock - ? WHERE id = ?",
        [quantity, variantId]
      );
    }

    // Simulate transaction processing
    const transactionStatus = Math.random() < 0.8 ? "completed" : "failed";

    if (transactionStatus === "completed") {
      await connection.query("UPDATE orders SET status = ? WHERE id = ?", [
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

      await connection.commit();
      res.json({
        success: true,
        orderNumber,
        message: "Order placed successfully",
      });
    } else {
      await connection.query("UPDATE orders SET status = ? WHERE id = ?", [
        "failed",
        orderId,
      ]);

      // Send failure email
      await sendTransactionFailed({
        orderNumber,
        customerInfo,
      });

      await connection.commit();
      res.status(400).json({
        success: false,
        message: "Transaction failed. Please try again.",
      });
    }
  } catch (error) {
    await connection.rollback();
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Error creating order" });
  } finally {
    connection.release();
  }
};

const getOrderByNumber = async (req, res) => {
  try {
    const { orderNumber } = req.params;

    const [orders] = await pool.query(
      `SELECT o.*, p.name as product_name, p.price as product_price,
              v.name as variant_name, v.value as variant_value,
              ci.full_name, ci.email, ci.phone, ci.address, ci.city, ci.state, ci.zip_code
       FROM orders o
       JOIN products p ON o.product_id = p.id
       LEFT JOIN variants v ON o.variant_id = v.id
       JOIN customer_info ci ON o.id = ci.order_id
       WHERE o.order_number = ?`,
      [orderNumber]
    );

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
