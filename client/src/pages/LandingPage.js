import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Box,
  Paper,
  useTheme,
  alpha,
  Rating,
  Chip,
  Stack,
} from "@mui/material";
import { getProducts } from "../services/api";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import SecurityIcon from "@mui/icons-material/Security";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";

const LandingPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [stockError, setStockError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const products = await getProducts();
        if (products.length > 0) {
          setProduct(products[0]);
          if (products[0].variants.length > 0) {
            setSelectedVariant(products[0].variants[0].id);
          }
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, []);

  const handleQuantityChange = (e) => {
    const newQuantity = Math.max(1, parseInt(e.target.value) || 1);
    const selectedVariantData = product.variants.find(
      (v) => v.id === selectedVariant
    );

    if (selectedVariantData && newQuantity > selectedVariantData.stock) {
      setStockError(`Only ${selectedVariantData.stock} items available`);
      setQuantity(selectedVariantData.stock);
    } else {
      setStockError("");
      setQuantity(newQuantity);
    }
  };

  const handleVariantChange = (e) => {
    const newVariantId = e.target.value;
    setSelectedVariant(newVariantId);

    const selectedVariantData = product.variants.find(
      (v) => v.id === newVariantId
    );

    if (selectedVariantData && quantity > selectedVariantData.stock) {
      setStockError(`Only ${selectedVariantData.stock} items available`);
      setQuantity(selectedVariantData.stock);
    } else {
      setStockError("");
    }
  };

  const handleBuyNow = () => {
    const selectedVariantData = product.variants.find(
      (v) => v.id === selectedVariant
    );

    if (!selectedVariantData || selectedVariantData.stock < quantity) {
      setStockError("Not enough stock available");
      return;
    }

    const totalPrice =
      (product.price + (selectedVariantData?.price_adjustment || 0)) * quantity;

    const orderData = {
      productId: product.id,
      variantId: selectedVariant,
      quantity,
      productName: product.name,
      totalPrice,
    };
    navigate("/checkout", { state: { orderData } });
  };

  if (loading) {
    return (
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <Typography variant="h6" color="text.secondary">
          Loading...
        </Typography>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <Typography variant="h6" color="error">
          Product not found
        </Typography>
      </Container>
    );
  }

  const selectedVariantData = product.variants.find(
    (v) => v.id === selectedVariant
  );
  const totalPrice =
    (product.price + (selectedVariantData?.price_adjustment || 0)) * quantity;

  return (
    <Box
      sx={{
        bgcolor: alpha(theme.palette.primary.main, 0.05),
        minHeight: "100vh",
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <Paper elevation={0} sx={{ p: 4, borderRadius: 2 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Card
                elevation={0}
                sx={{
                  borderRadius: 2,
                  overflow: "hidden",
                  position: "relative",
                  "&:hover": {
                    "& .MuiCardMedia-root": {
                      transform: "scale(1.05)",
                    },
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="500"
                  image={product.image_url}
                  alt={product.name}
                  sx={{
                    transition: "transform 0.3s ease-in-out",
                    objectFit: "cover",
                  }}
                />
                <Chip
                  label="New Arrival"
                  color="primary"
                  sx={{
                    position: "absolute",
                    top: 16,
                    left: 16,
                    fontWeight: "bold",
                  }}
                />
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Typography
                  variant="h3"
                  gutterBottom
                  sx={{ fontWeight: "bold" }}
                >
                  {product.name}
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Rating value={4.5} precision={0.5} readOnly />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ ml: 1 }}
                  >
                    (120 reviews)
                  </Typography>
                </Box>

                <Typography
                  variant="h4"
                  color="primary"
                  sx={{ mb: 3, fontWeight: "bold" }}
                >
                  ${totalPrice.toFixed(2)}
                </Typography>

                <Typography
                  variant="body1"
                  paragraph
                  sx={{ color: "text.secondary", mb: 4 }}
                >
                  {product.description}
                </Typography>

                <Box sx={{ mb: 4 }}>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Color</InputLabel>
                    <Select
                      value={selectedVariant}
                      label="Color"
                      onChange={handleVariantChange}
                      sx={{ borderRadius: 2 }}
                    >
                      {product.variants.map((variant) => (
                        <MenuItem
                          key={variant.id}
                          value={variant.id}
                          disabled={variant.stock === 0}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              width: "100%",
                            }}
                          >
                            <Typography>
                              {variant.value}
                              {variant.stock === 0 && " (Out of Stock)"}
                            </Typography>
                            <Typography color="primary">
                              +${variant.price_adjustment.toFixed(2)}
                            </Typography>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <TextField
                    fullWidth
                    type="number"
                    label="Quantity"
                    value={quantity}
                    onChange={handleQuantityChange}
                    inputProps={{
                      min: 1,
                      max: selectedVariantData?.stock || 1,
                    }}
                    error={!!stockError}
                    helperText={stockError}
                    sx={{ mb: 2, borderRadius: 2 }}
                  />

                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    fullWidth
                    onClick={handleBuyNow}
                    startIcon={<ShoppingCartIcon />}
                    disabled={!!stockError || !selectedVariantData?.stock}
                    sx={{
                      py: 1.5,
                      borderRadius: 2,
                      textTransform: "none",
                      fontSize: "1.1rem",
                      fontWeight: "bold",
                      boxShadow: 3,
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: 6,
                      },
                      transition: "all 0.2s ease-in-out",
                    }}
                  >
                    {selectedVariantData?.stock === 0
                      ? "Out of Stock"
                      : "Buy Now"}
                  </Button>
                </Box>

                <Box sx={{ mt: "auto" }}>
                  <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                    <Chip
                      icon={<LocalShippingIcon />}
                      label="Free Shipping"
                      variant="outlined"
                      sx={{ borderRadius: 2 }}
                    />
                    <Chip
                      icon={<SecurityIcon />}
                      label="Secure Payment"
                      variant="outlined"
                      sx={{ borderRadius: 2 }}
                    />
                    <Chip
                      icon={<SupportAgentIcon />}
                      label="24/7 Support"
                      variant="outlined"
                      sx={{ borderRadius: 2 }}
                    />
                  </Stack>

                  <Button
                    variant="outlined"
                    color="primary"
                    fullWidth
                    startIcon={<FavoriteIcon />}
                    sx={{
                      borderRadius: 2,
                      textTransform: "none",
                      py: 1.5,
                    }}
                  >
                    Add to Wishlist
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default LandingPage;
