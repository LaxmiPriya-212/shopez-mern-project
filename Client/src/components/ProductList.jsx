import { useEffect, useState } from "react";
import { getProducts } from "../api/productApi";
import { addToCart } from "../api/cartApi";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    fetchProducts();
  }, []);

  // Fetch Products
  const fetchProducts = async () => {
    try {
      const { data } = await getProducts();
      setProducts(data.products);
    } catch (error) {
      console.log(error);
    }
  };

  // Add To Cart
  const handleAddToCart = async (productId) => {
    try {
      const userId = "6a31732db963cb5a5a2e170f";

      await addToCart({
        userId,
        productId,
        quantity: 1,
      });

      alert("Product Added To Cart 🛒");
    } catch (error) {
      console.log(error);
      alert("Failed To Add Product");
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1
        style={{
          textAlign: "center",
          fontSize: "48px",
          marginBottom: "30px",
        }}
      >
        Featured Products
      </h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="🔍 Search Products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          maxWidth: "600px",
          display: "block",
          margin: "0 auto 20px auto",
          padding: "15px",
          borderRadius: "12px",
          border: "1px solid #ddd",
          fontSize: "16px",
          outline: "none",
        }}
      />

      {/* Category Filters */}
<div
  style={{
    display: "flex",
    justifyContent: "center",
    gap: "15px",
    marginBottom: "30px",
    flexWrap: "wrap",
  }}
>
  {[
    "All",
    "Mobiles",
    "Laptops",
    "Accessories",
    "Tablets",
    "Wearables",
    "TVs",
  ].map((cat) => (
    <button
      key={cat}
      onClick={() => setCategory(cat)}
      style={{
        padding: "10px 20px",
        border: "none",
        borderRadius: "25px",
        cursor: "pointer",
        fontWeight: "bold",
        background:
          category === cat
            ? "#2563eb"
            : "#e5e7eb",
        color:
          category === cat
            ? "white"
            : "black",
      }}
    >
      {cat}
    </button>
  ))}
</div>
      {/* Product Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "25px",
        }}
      >
        {products
          .filter((product) =>
            product.name
              .toLowerCase()
              .includes(search.toLowerCase())
          )
          .filter(
            (product) =>
              category === "All" ||
              product.category === category
          )
          .map((product) => (
            <div
              key={product._id}
              style={{
                borderRadius: "16px",
                padding: "15px",
                background:
                  "linear-gradient(to bottom, #ffffff, #f8fafc)",
                boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
              }}
            >
  <img
  src={
    product.category === "Mobiles"
      ? "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800"
      : product.category === "Laptops"
      ? "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800"
      : product.category === "Accessories"
      ? "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800"
      : product.category === "Tablets"
      ? "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800"
      : product.category === "Wearables"
      ? "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800"
      : product.category === "TVs"
      ? "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800"
      : "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800"
  }
  alt={product.name}
  style={{
    width: "100%",
    height: "220px",
    objectFit: "cover",
    borderRadius: "10px",
    marginBottom: "15px",
  }}
/>
              <h2>{product.name}</h2>

              <p style={{ color: "#666" }}>
                {product.description}
              </p>

              <h2 style={{ color: "#2563eb" }}>
                ₹{product.price}
              </h2>

              <button
                onClick={() =>
                  handleAddToCart(product._id)
                }
                style={{
                  width: "100%",
                  padding: "12px",
                  background: "#2563eb",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  marginTop: "10px",
                  fontSize: "16px",
                  letterSpacing: "0.5px",
                }}
              >
                🛒 Add To Cart
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}

export default ProductList;