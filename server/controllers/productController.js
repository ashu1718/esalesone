const pool = require("../config/db");

const getProducts = async (req, res) => {
  try {
    const productsResult = await pool.query("SELECT * FROM products");
    const variantsResult = await pool.query("SELECT * FROM variants");

    const products = productsResult.rows;
    const variants = variantsResult.rows;

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
    const productsResult = await pool.query(
      "SELECT * FROM products WHERE id = $1",
      [id]
    );
    const variantsResult = await pool.query(
      "SELECT * FROM variants WHERE product_id = $1",
      [id]
    );

    const products = productsResult.rows;
    const variants = variantsResult.rows;

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
