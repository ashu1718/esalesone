import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Card,
  CardContent,
  Typography,
  Box,
  Divider,
  Button,
  CircularProgress,
} from "@mui/material";
import { getOrderByNumber } from "../services/api";

const ThankYouPage = () => {
  const { orderNumber } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orderData = await getOrderByNumber(orderNumber);
        setOrder(orderData);
      } catch (error) {
        console.error("Error fetching order:", error);
        setError("Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderNumber]);

  if (loading) {
    return (
      <Container sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error || !order) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography color="error">{error || "Order not found"}</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/")}
          sx={{ mt: 2 }}
        >
          Return to Home
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Card>
        <CardContent>
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography variant="h4" color="primary" gutterBottom>
              Thank You for Your Order!
            </Typography>
            <Typography variant="h6" gutterBottom>
              Order Number: {order.order_number}
            </Typography>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom>
            Order Details
          </Typography>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1">{order.product_name}</Typography>
            <Typography variant="body2" color="text.secondary">
              Quantity: {order.quantity}
            </Typography>
            {order.variant_value && (
              <Typography variant="body2" color="text.secondary">
                Color: {order.variant_value}
              </Typography>
            )}
          </Box>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom>
            Shipping Information
          </Typography>
          <Box sx={{ mb: 3 }}>
            <Typography>{order.full_name}</Typography>
            <Typography>{order.address}</Typography>
            <Typography>
              {order.city}, {order.state} {order.zip_code}
            </Typography>
            <Typography>{order.email}</Typography>
            <Typography>{order.phone}</Typography>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography>Subtotal</Typography>
            <Typography>${order.total_amount.toFixed(2)}</Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography>Shipping</Typography>
            <Typography>Free</Typography>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h6">Total</Typography>
            <Typography variant="h6">
              ${order.total_amount.toFixed(2)}
            </Typography>
          </Box>

          <Box sx={{ mt: 4, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary" paragraph>
              A confirmation email has been sent to {order.email}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/")}
            >
              Return to Home
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default ThankYouPage;
