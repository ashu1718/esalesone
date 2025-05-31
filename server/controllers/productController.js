const pool = require("../config/db");

const getProducts = async (req, res) => {
  try {
    const [products] = await pool.query("SELECT * FROM products");
    const [variants] = await pool.query("SELECT * FROM variants");

    // Attach variants to their respective products and parse numeric values
    const productsWithVariants = products.map((product) => ({
      ...product,
      price: parseFloat(product.price),
      variants: variants
        .filter((variant) => variant.product_id === product.id)
        .map((variant) => ({
          ...variant,
          price_adjustment: parseFloat(variant.price_adjustment),
          stock: parseInt(variant.stock),
        })),
    }));

    res.json(productsWithVariants);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Error fetching products" });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const [products] = await pool.query("SELECT * FROM products WHERE id = ?", [
      id,
    ]);
    const [variants] = await pool.query(
      "SELECT * FROM variants WHERE product_id = ?",
      [id]
    );

    if (products.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    const product = {
      ...products[0],
      price: parseFloat(products[0].price),
      variants: variants.map((variant) => ({
        ...variant,
        price_adjustment: parseFloat(variant.price_adjustment),
        stock: parseInt(variant.stock),
      })),
    };

    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Error fetching product" });
  }
};

module.exports = {
  getProducts,
  getProductById,
};
