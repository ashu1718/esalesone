-- Drop existing tables if they exist
DROP TABLE IF EXISTS customer_info;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS variants;
DROP TABLE IF EXISTS products;

-- Create products table
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL
);

-- Create variants table
CREATE TABLE variants (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id),
    name VARCHAR(255) NOT NULL,
    value VARCHAR(255) NOT NULL,
    price_adjustment DECIMAL(10,2) NOT NULL,
    stock INTEGER NOT NULL
);

-- Create orders table
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    order_number VARCHAR(255) UNIQUE NOT NULL,
    product_id INTEGER REFERENCES products(id),
    variant_id INTEGER REFERENCES variants(id),
    quantity INTEGER NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending'
);

-- Create customer_info table
CREATE TABLE customer_info (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    zip_code VARCHAR(20) NOT NULL
);

-- Insert sample products
INSERT INTO products (name, price) VALUES
    ('Premium T-Shirt', 29.99),
    ('Designer Jeans', 89.99),
    ('Running Shoes', 129.99),
    ('Leather Jacket', 199.99),
    ('Casual Watch', 149.99);

-- Insert sample variants
INSERT INTO variants (product_id, name, value, price_adjustment, stock) VALUES
    (1, 'Size', 'Small', 0.00, 50),
    (1, 'Size', 'Medium', 0.00, 75),
    (1, 'Size', 'Large', 0.00, 50),
    (1, 'Color', 'Black', 0.00, 100),
    (1, 'Color', 'White', 0.00, 100),
    (1, 'Color', 'Blue', 0.00, 100),
    (2, 'Size', '30', 0.00, 30),
    (2, 'Size', '32', 0.00, 40),
    (2, 'Size', '34', 0.00, 35),
    (2, 'Color', 'Blue', 0.00, 50),
    (2, 'Color', 'Black', 0.00, 50),
    (3, 'Size', '7', 0.00, 25),
    (3, 'Size', '8', 0.00, 30),
    (3, 'Size', '9', 0.00, 35),
    (3, 'Color', 'Red', 0.00, 45),
    (3, 'Color', 'Blue', 0.00, 45),
    (4, 'Size', 'S', 0.00, 20),
    (4, 'Size', 'M', 0.00, 25),
    (4, 'Size', 'L', 0.00, 20),
    (4, 'Color', 'Brown', 0.00, 30),
    (4, 'Color', 'Black', 0.00, 35),
    (5, 'Style', 'Classic', 0.00, 40),
    (5, 'Style', 'Sport', 0.00, 35),
    (5, 'Color', 'Silver', 0.00, 40),
    (5, 'Color', 'Gold', 0.00, 35); 