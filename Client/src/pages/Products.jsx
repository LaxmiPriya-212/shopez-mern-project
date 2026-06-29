import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { getProducts } from "../api/productApi";
import ProductCard from "../components/ProductCard";
import { ProductGridSkeleton } from "../components/LoadingSkeleton";
import Rating from "../components/Rating";

function Products() {
  const [searchParams, setSearchParams] = useSearchParams();

  // State
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Filters state (synchronized with URL search parameters)
  const categoryParam = searchParams.get("category") || "All";
  const brandParam = searchParams.get("brand") || "All";
  const ratingParam = searchParams.get("rating") || "";
  const minPriceParam = searchParams.get("minPrice") || "";
  const maxPriceParam = searchParams.get("maxPrice") || "";
  const sortByParam = searchParams.get("sortBy") || "newest";
  const searchParam = searchParams.get("search") || "";

  // Temporary price inputs
  const [priceRange, setPriceRange] = useState({
    min: minPriceParam,
    max: maxPriceParam,
  });

  const fetchFilteredProducts = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        keyword: searchParam,
        category: categoryParam,
        brand: brandParam,
        rating: ratingParam,
        minPrice: minPriceParam,
        maxPrice: maxPriceParam,
        sortBy: sortByParam,
        page,
        limit: 9,
      };

      const { data } = await getProducts(params);
      if (data.success) {
        setProducts(data.products);
        setPages(data.pages);
        setTotal(data.count);
        
        // Populate filter options dynamically from backend
        if (data.categories) setCategories(data.categories);
        if (data.brands) setBrands(data.brands);
      }
    } catch (error) {
      console.error("Error fetching products", error);
    } finally {
      setLoading(false);
    }
  }, [searchParam, categoryParam, brandParam, ratingParam, minPriceParam, maxPriceParam, sortByParam, page]);

  useEffect(() => {
    fetchFilteredProducts();
  }, [fetchFilteredProducts]);

  // Handle URL updates
  const updateFilterParam = (key, value) => {
    setPage(1); // Reset page on filter change
    const newParams = new URLSearchParams(searchParams);
    if (value && value !== "All") {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const handlePriceApply = (e) => {
    e.preventDefault();
    setPage(1);
    const newParams = new URLSearchParams(searchParams);
    if (priceRange.min) newParams.set("minPrice", priceRange.min);
    else newParams.delete("minPrice");
    if (priceRange.max) newParams.set("maxPrice", priceRange.max);
    else newParams.delete("maxPrice");
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    setPage(1);
    setPriceRange({ min: "", max: "" });
    setSearchParams({});
  };

  return (
    <div className="section-padding anim-fade-in" style={{ minHeight: "85vh" }}>
      <div className="container">
        
        {/* Search Results Header */}
        {searchParam && (
          <div style={{ marginBottom: "24px", textAlign: "left" }}>
            <h2>Search Results for: "{searchParam}"</h2>
            <span style={{ color: "var(--text-muted)" }}>{total} products found</span>
          </div>
        )}

        <div className="grid-sidebar">
          
          {/* Filters Sidebar */}
          <aside
            className="glass-card"
            style={{
              padding: "24px",
              height: "fit-content",
              display: "flex",
              flexDirection: "column",
              gap: "24px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ fontSize: "1.25rem" }}>Filters</h3>
              <button
                onClick={clearAllFilters}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--primary)",
                  fontWeight: "600",
                  fontSize: "0.85rem",
                  cursor: "pointer",
                }}
              >
                Clear All
              </button>
            </div>

            <hr style={{ border: "none", borderTop: "1px solid var(--border-color)" }} />

            {/* Categories Filter */}
            <div>
              <h4 style={{ fontSize: "0.95rem", marginBottom: "12px" }}>Category</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <button
                  onClick={() => updateFilterParam("category", "All")}
                  style={getFilterButtonStyle(categoryParam === "All")}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => updateFilterParam("category", cat)}
                    style={getFilterButtonStyle(categoryParam === cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Brand Filter */}
            <div>
              <h4 style={{ fontSize: "0.95rem", marginBottom: "12px" }}>Brand</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <button
                  onClick={() => updateFilterParam("brand", "All")}
                  style={getFilterButtonStyle(brandParam === "All")}
                >
                  All Brands
                </button>
                {brands.map((brand) => (
                  <button
                    key={brand}
                    onClick={() => updateFilterParam("brand", brand)}
                    style={getFilterButtonStyle(brandParam === brand)}
                  >
                    {brand}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div>
              <h4 style={{ fontSize: "0.95rem", marginBottom: "12px" }}>Price Range</h4>
              <form onSubmit={handlePriceApply} style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                  style={{ ...filterInputStyle, padding: "8px" }}
                />
                <span style={{ color: "var(--text-muted)" }}>to</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                  style={{ ...filterInputStyle, padding: "8px" }}
                />
                <button type="submit" className="btn btn-primary btn-sm" style={{ padding: "8px 12px" }}>
                  Go
                </button>
              </form>
            </div>

            {/* Rating Filter */}
            <div>
              <h4 style={{ fontSize: "0.95rem", marginBottom: "12px" }}>Minimum Rating</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {[4, 3, 2, 1].map((stars) => (
                  <button
                    key={stars}
                    onClick={() => updateFilterParam("rating", String(stars))}
                    style={{
                      ...getFilterButtonStyle(ratingParam === String(stars)),
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <Rating value={stars} />
                    <span>& Up</span>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Products Column */}
          <main>
            
            {/* Sort & Stats Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "24px",
                flexWrap: "wrap",
                gap: "16px",
              }}
            >
              <span style={{ fontWeight: "500", color: "var(--text-muted)" }}>
                Showing {products.length} of {total} products
              </span>

              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ fontSize: "0.9rem", fontWeight: "600" }}>Sort By:</span>
                <select
                  value={sortByParam}
                  onChange={(e) => updateFilterParam("sortBy", e.target.value)}
                  className="form-input"
                  style={{ width: "180px", padding: "8px 12px", fontSize: "0.9rem" }}
                >
                  <option value="newest">Newest First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            {loading ? (
              <ProductGridSkeleton count={6} />
            ) : products.length === 0 ? (
              <div
                className="glass-card"
                style={{
                  padding: "60px 40px",
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "16px",
                }}
              >
                <span style={{ fontSize: "3.5rem" }}>🔎</span>
                <h2>No Products Found</h2>
                <p style={{ color: "var(--text-muted)", maxWidth: "400px" }}>
                  We couldn't find any products matching your selection. Try clearing your filters or searching for something else.
                </p>
                <button onClick={clearAllFilters} className="btn btn-primary">
                  Clear All Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid-3" style={{ gap: "24px" }}>
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {pages > 1 && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "8px",
                      marginTop: "48px",
                    }}
                  >
                    <button
                      disabled={page === 1}
                      onClick={() => setPage(page - 1)}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: "8px 16px" }}
                    >
                      ◀ Prev
                    </button>
                    
                    {Array.from({ length: pages }).map((_, i) => {
                      const pageNum = i + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPage(pageNum)}
                          className={`btn btn-sm ${page === pageNum ? "btn-primary" : "btn-secondary"}`}
                          style={{
                            padding: "8px 14px",
                            minWidth: "38px",
                            boxShadow: page === pageNum ? "var(--shadow-sm)" : "none",
                          }}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    <button
                      disabled={page === pages}
                      onClick={() => setPage(page + 1)}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: "8px 16px" }}
                    >
                      Next ▶
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

const getFilterButtonStyle = (isActive) => ({
  background: isActive ? "rgba(79, 70, 229, 0.1)" : "none",
  border: "none",
  color: isActive ? "var(--primary)" : "var(--text-main)",
  fontWeight: isActive ? "700" : "500",
  textAlign: "left",
  padding: "8px 12px",
  borderRadius: "var(--radius-sm)",
  cursor: "pointer",
  fontSize: "0.9rem",
  transition: "var(--transition-fast)",
  width: "100%",
});

const filterInputStyle = {
  width: "100%",
  background: "var(--bg-surface)",
  border: "1px solid var(--border-color)",
  borderRadius: "var(--radius-sm)",
  fontSize: "0.85rem",
  outline: "none",
};

export default Products;
