import { useState } from "react";
import { createProduct } from "../api/productApi";

function AdminAddProduct() {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
    stock: "",
  });

  const handleChange = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createProduct(product);

      alert("✅ Product Added Successfully");

      setProduct({
        name: "",
        description: "",
        price: "",
        category: "",
        image: "",
        stock: "",
      });
    } catch (error) {
      console.log(error);
      alert("❌ Failed To Add Product");
    }
  };

  return (
    <div
      style={{
        minHeight: "85vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
          "linear-gradient(135deg,#f8fafc,#e2e8f0)",
        padding: "30px",
      }}
    >
      <div
        style={{
          width: "650px",
          background: "white",
          padding: "30px",
          borderRadius: "20px",
          boxShadow: "0 15px 35px rgba(0,0,0,0.1)",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            marginBottom: "25px",
          }}
        >
          ➕ Add Product
        </h1>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={product.name}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <input
            type="text"
            name="description"
            placeholder="Description"
            value={product.description}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <input
            type="number"
            name="price"
            placeholder="Price"
            value={product.price}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <input
            type="text"
            name="category"
            placeholder="Category (Mobiles, Laptops...)"
            value={product.category}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <input
            type="text"
            name="image"
            placeholder="Image URL"
            value={product.image}
            onChange={handleChange}
            style={inputStyle}
          />

          <input
            type="number"
            name="stock"
            placeholder="Stock"
            value={product.stock}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "14px",
              background: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "10px",
              fontWeight: "bold",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            ➕ Add Product
          </button>
        </form>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "14px",
  marginBottom: "15px",
  borderRadius: "10px",
  border: "1px solid #ddd",
  fontSize: "16px",
  boxSizing: "border-box",
};

export default AdminAddProduct;