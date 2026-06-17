import { useEffect, useState } from "react";
import {
  getProducts,
  deleteProduct,
} from "../api/productApi";

function AdminProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await getProducts();
      setProducts(data.products);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);

      alert("✅ Product Deleted Successfully");

      fetchProducts();
    } catch (error) {
      console.log(error);
      alert("❌ Failed To Delete Product");
    }
  };

  return (
    <div
      style={{
        padding: "30px",
        minHeight: "100vh",
        background: "#f8fafc",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          marginBottom: "30px",
        }}
      >
        📦 Manage Products
      </h1>

      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "15px",
          boxShadow:
            "0 10px 20px rgba(0,0,0,0.08)",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  border: "1px solid #ddd",
                  padding: "12px",
                }}
              >
                Product
              </th>

              <th
                style={{
                  border: "1px solid #ddd",
                  padding: "12px",
                }}
              >
                Price
              </th>

              <th
                style={{
                  border: "1px solid #ddd",
                  padding: "12px",
                }}
              >
                Category
              </th>

              <th
                style={{
                  border: "1px solid #ddd",
                  padding: "12px",
                }}
              >
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td
                  style={{
                    border: "1px solid #ddd",
                    padding: "12px",
                  }}
                >
                  {product.name}
                </td>

                <td
                  style={{
                    border: "1px solid #ddd",
                    padding: "12px",
                  }}
                >
                  ₹{product.price}
                </td>

                <td
                  style={{
                    border: "1px solid #ddd",
                    padding: "12px",
                  }}
                >
                  {product.category}
                </td>

                <td
                  style={{
                    border: "1px solid #ddd",
                    padding: "12px",
                  }}
                >
                  <button
                    onClick={() =>
                      handleDelete(product._id)
                    }
                    style={{
                      background: "#ef4444",
                      color: "white",
                      border: "none",
                      padding: "8px 15px",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                  >
                    Delete ❌
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminProducts;