import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Divider,
} from "@mui/material";
import { createOrder } from "../services/api";

const validationSchema = Yup.object({
  fullName: Yup.string().required("Full name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
    .required("Phone number is required"),
  address: Yup.string().required("Address is required"),
  city: Yup.string().required("City is required"),
  state: Yup.string().required("State is required"),
  zipCode: Yup.string()
    .matches(/^[0-9]{6}$/, "Zip code must be 6 digits")
    .required("Zip code is required"),
  cardNumber: Yup.string()
    .matches(/^[0-9]{16}$/, "Card number must be 16 digits")
    .required("Card number is required"),
  expiryDate: Yup.string()
    .matches(
      /^(0[1-9]|1[0-2])\/([0-9]{2})$/,
      "Expiry date must be in MM/YY format"
    )
    .required("Expiry date is required"),
  cvv: Yup.string()
    .matches(/^[0-9]{3}$/, "CVV must be 3 digits")
    .required("CVV is required"),
});

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderData } = location.state || {};

  if (!orderData) {
    navigate("/");
    return null;
  }
  console.log("orderData", orderData.totalPrice);
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await createOrder({
        ...orderData,
        customerInfo: {
          fullName: values.fullName,
          email: values.email,
          phone: values.phone,
          address: values.address,
          city: values.city,
          state: values.state,
          zipCode: values.zipCode,
        },
        totalAmount: orderData.totalPrice,
      });

      if (response.success) {
        navigate(`/thank-you/${response.orderNumber}`);
      } else {
        alert("Transaction failed. Please try again.");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Shipping Information
              </Typography>
              <Formik
                initialValues={{
                  fullName: "",
                  email: "",
                  phone: "",
                  address: "",
                  city: "",
                  state: "",
                  zipCode: "",
                  cardNumber: "",
                  expiryDate: "",
                  cvv: "",
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({
                  values,
                  errors,
                  touched,
                  handleChange,
                  handleBlur,
                  isSubmitting,
                }) => (
                  <Form>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          name="fullName"
                          label="Full Name"
                          value={values.fullName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.fullName && Boolean(errors.fullName)}
                          helperText={touched.fullName && errors.fullName}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          name="email"
                          label="Email"
                          value={values.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.email && Boolean(errors.email)}
                          helperText={touched.email && errors.email}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          name="phone"
                          label="Phone Number"
                          value={values.phone}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.phone && Boolean(errors.phone)}
                          helperText={touched.phone && errors.phone}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          name="address"
                          label="Address"
                          value={values.address}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.address && Boolean(errors.address)}
                          helperText={touched.address && errors.address}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          name="city"
                          label="City"
                          value={values.city}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.city && Boolean(errors.city)}
                          helperText={touched.city && errors.city}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          name="state"
                          label="State"
                          value={values.state}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.state && Boolean(errors.state)}
                          helperText={touched.state && errors.state}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          name="zipCode"
                          label="Zip Code"
                          value={values.zipCode}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.zipCode && Boolean(errors.zipCode)}
                          helperText={touched.zipCode && errors.zipCode}
                        />
                      </Grid>
                    </Grid>

                    <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
                      Payment Information
                    </Typography>

                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          name="cardNumber"
                          label="Card Number"
                          value={values.cardNumber}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={
                            touched.cardNumber && Boolean(errors.cardNumber)
                          }
                          helperText={touched.cardNumber && errors.cardNumber}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          name="expiryDate"
                          label="Expiry Date (MM/YY)"
                          value={values.expiryDate}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={
                            touched.expiryDate && Boolean(errors.expiryDate)
                          }
                          helperText={touched.expiryDate && errors.expiryDate}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          name="cvv"
                          label="CVV"
                          value={values.cvv}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.cvv && Boolean(errors.cvv)}
                          helperText={touched.cvv && errors.cvv}
                        />
                      </Grid>
                    </Grid>

                    <Box sx={{ mt: 4 }}>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        size="large"
                        fullWidth
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Processing..." : "Place Order"}
                      </Button>
                    </Box>
                  </Form>
                )}
              </Formik>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Order Summary
              </Typography>
              <Box sx={{ my: 2 }}>
                <Typography variant="subtitle1">
                  {orderData.productName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Quantity: {orderData.quantity}
                </Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography>Subtotal</Typography>
                <Typography>${orderData?.totalPrice?.toFixed(2)}</Typography>
              </Box>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography>Shipping</Typography>
                <Typography>Free</Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="h6">Total</Typography>
                <Typography variant="h6">
                  ${orderData?.totalPrice?.toFixed(2)}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CheckoutPage;
