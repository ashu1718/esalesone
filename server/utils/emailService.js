const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_HOST,
  port: process.env.MAILTRAP_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS,
  },
});

// Verify transporter configuration
transporter.verify(function (error, success) {
  if (error) {
    console.error("SMTP connection error:", error);
  } else {
    console.log("SMTP server is ready to take our messages");
  }
});

const sendOrderConfirmation = async (orderData) => {
  const { orderNumber, customerInfo, productInfo, total } = orderData;

  const mailOptions = {
    from: `"eSalesOne" <${process.env.EMAIL_FROM}>`,
    to: customerInfo.email,
    subject: `Order Confirmation - Order #${orderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1976d2;">Thank you for your order!</h1>
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px;">
          <h2 style="color: #333;">Order Details</h2>
          <p><strong>Order Number:</strong> ${orderNumber}</p>
          <p><strong>Product:</strong> ${productInfo.name}</p>
          <p><strong>Quantity:</strong> ${productInfo.quantity}</p>
          <p><strong>Total:</strong> $${total.toFixed(2)}</p>
        </div>
        <div style="margin-top: 20px;">
          <h2 style="color: #333;">Shipping Information</h2>
          <p><strong>Name:</strong> ${customerInfo.fullName}</p>
          <p><strong>Address:</strong> ${customerInfo.address}</p>
          <p><strong>City:</strong> ${customerInfo.city}</p>
          <p><strong>State:</strong> ${customerInfo.state}</p>
          <p><strong>Zip Code:</strong> ${customerInfo.zipCode}</p>
        </div>
        <div style="margin-top: 20px; text-align: center; color: #666;">
          <p>If you have any questions, please contact our support team.</p>
          <p>Support Email: support@esalesone.com</p>
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Order confirmation email sent:", info.messageId);
    return true;
  } catch (error) {
    console.error("Email sending failed:", error);
    return false;
  }
};

const sendTransactionFailed = async (orderData) => {
  const { orderNumber, customerInfo } = orderData;

  const mailOptions = {
    from: `"eSalesOne" <${process.env.EMAIL_FROM || "noreply@esalesone.com"}>`,
    to: customerInfo.email,
    subject: `Transaction Failed - Order #${orderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #dc004e;">Transaction Failed</h1>
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px;">
          <p>We're sorry, but your transaction for Order #${orderNumber} could not be processed.</p>
          <p>Please try again or contact our support team for assistance.</p>
        </div>
        <div style="margin-top: 20px; text-align: center; color: #666;">
          <p>Support Email: support@esalesone.com</p>
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Transaction failed email sent:", info.messageId);
    return true;
  } catch (error) {
    console.error("Email sending failed:", error);
    return false;
  }
};

module.exports = {
  sendOrderConfirmation,
  sendTransactionFailed,
};
