import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getMyOrders } from "../api/orderApi";
import { useToast } from "../context/ToastContext";

function Profile() {
  const { user, updateProfile, changePassword } = useAuth();
  const { showToast } = useToast();

  // State
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Profile Edit State
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
  });
  const [editingProfile, setEditingProfile] = useState(false);

  // Address Form State
  const [newAddress, setNewAddress] = useState({
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
  });
  const [addingAddress, setAddingAddress] = useState(false);

  // Password Change State
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [changingPass, setChangingPass] = useState(false);

  // Load User Data & Orders
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
      });
    }

    const fetchOrders = async () => {
      try {
        setLoadingOrders(true);
        const { data } = await getMyOrders();
        if (data.success) {
          setOrders(data.orders);
        }
      } catch (error) {
        console.error("Error fetching user orders", error);
      } finally {
        setLoadingOrders(false);
      }
    };
    fetchOrders();
  }, [user]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setEditingProfile(true);
    const success = await updateProfile(profileData);
    setEditingProfile(false);
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    if (!newAddress.street || !newAddress.city || !newAddress.state || !newAddress.postalCode) {
      showToast("Please fill in all address fields", "warning");
      return;
    }

    setAddingAddress(true);
    const updatedAddresses = [...(user.addresses || []), newAddress];
    const success = await updateProfile({ addresses: updatedAddresses });
    setAddingAddress(false);
    
    if (success) {
      setNewAddress({ street: "", city: "", state: "", postalCode: "", country: "India" });
    }
  };

  const handleAddressDelete = async (indexToDelete) => {
    const updatedAddresses = user.addresses.filter((_, i) => i !== indexToDelete);
    await updateProfile({ addresses: updatedAddresses });
    showToast("Address deleted", "success");
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword.length < 6) {
      showToast("New password must be at least 6 characters", "warning");
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast("Passwords do not match", "error");
      return;
    }

    setChangingPass(true);
    const success = await changePassword({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
    });
    setChangingPass(false);

    if (success) {
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    }
  };

  return (
    <div className="section-padding anim-fade-in" style={{ minHeight: "85vh", textAlign: "left" }}>
      <div className="container">
        <h1 style={{ marginBottom: "32px", fontSize: "2.25rem" }}>My Profile</h1>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.1fr 1.3fr",
            gap: "40px",
            alignItems: "start",
          }}
          className="profile-layout"
        >
          {/* Left Column: Profile settings, Address Book, Change Password */}
          <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
            
            {/* Profile Info Form */}
            <div className="glass-card" style={{ padding: "30px" }}>
              <h3 style={{ fontSize: "1.25rem", marginBottom: "20px" }}>Account Settings</h3>
              <form onSubmit={handleProfileSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="profile-name">Full Name</label>
                  <input
                    id="profile-name"
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="profile-email">Email Address</label>
                  <input
                    id="profile-email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="profile-phone">Phone Number</label>
                  <input
                    id="profile-phone"
                    type="tel"
                    placeholder="10-digit mobile number"
                    value={profileData.phoneNumber}
                    onChange={(e) => setProfileData({ ...profileData, phoneNumber: e.target.value })}
                    className="form-input"
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ alignSelf: "flex-start", padding: "10px 24px" }} disabled={editingProfile}>
                  {editingProfile ? "Saving..." : "Save Profile Details"}
                </button>
              </form>
            </div>

            {/* Address Book Manager */}
            <div className="glass-card" style={{ padding: "30px" }}>
              <h3 style={{ fontSize: "1.25rem", marginBottom: "16px" }}>Address Book</h3>
              
              {/* List Saved Addresses */}
              {user?.addresses && user.addresses.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "24px" }}>
                  {user.addresses.map((addr, i) => (
                    <div
                      key={i}
                      style={{
                        padding: "16px",
                        border: "1px solid var(--border-color)",
                        borderRadius: "var(--radius-md)",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div style={{ fontSize: "0.9rem", lineHeight: "1.5" }}>
                        <strong>Address {i + 1}</strong><br />
                        {addr.street}, {addr.city}, {addr.state} - {addr.postalCode}<br />
                        Country: {addr.country}
                      </div>
                      <button
                        onClick={() => handleAddressDelete(i)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "var(--danger)",
                          cursor: "pointer",
                          fontWeight: "700",
                          fontSize: "1.1rem",
                        }}
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: "var(--text-muted)", marginBottom: "20px" }}>No addresses saved yet.</p>
              )}

              {/* Add New Address Form */}
              <h4 style={{ fontSize: "1.05rem", marginBottom: "12px", color: "var(--text-dark)" }}>Add New Address</h4>
              <form onSubmit={handleAddressSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <input
                  type="text"
                  placeholder="Street Address"
                  value={newAddress.street}
                  onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                  className="form-input"
                  style={{ padding: "10px 14px", fontSize: "0.85rem" }}
                  required
                />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <input
                    type="text"
                    placeholder="City"
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                    className="form-input"
                    style={{ padding: "10px 14px", fontSize: "0.85rem" }}
                    required
                  />
                  <input
                    type="text"
                    placeholder="State"
                    value={newAddress.state}
                    onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                    className="form-input"
                    style={{ padding: "10px 14px", fontSize: "0.85rem" }}
                    required
                  />
                </div>
                <input
                  type="text"
                  placeholder="Postal Code"
                  value={newAddress.postalCode}
                  onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                  className="form-input"
                  style={{ padding: "10px 14px", fontSize: "0.85rem" }}
                  required
                />
                <button type="submit" className="btn btn-secondary btn-sm" style={{ alignSelf: "flex-start" }} disabled={addingAddress}>
                  {addingAddress ? "Adding..." : "➕ Add Address"}
                </button>
              </form>
            </div>

            {/* Change Password Form */}
            <div className="glass-card" style={{ padding: "30px" }}>
              <h3 style={{ fontSize: "1.25rem", marginBottom: "20px" }}>Change Password</h3>
              <form onSubmit={handlePasswordSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="current-pass">Current Password</label>
                  <input
                    id="current-pass"
                    type="password"
                    placeholder="••••••••"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="new-pass">New Password</label>
                  <input
                    id="new-pass"
                    type="password"
                    placeholder="Min 6 characters"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="confirm-new-pass">Confirm New Password</label>
                  <input
                    id="confirm-new-pass"
                    type="password"
                    placeholder="Repeat new password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ alignSelf: "flex-start", padding: "10px 24px" }} disabled={changingPass}>
                  {changingPass ? "Updating..." : "Update Password"}
                </button>
              </form>
            </div>

          </div>

          {/* Right Column: Order History */}
          <div className="glass-card" style={{ padding: "30px", height: "fit-content" }}>
            <h3 style={{ fontSize: "1.25rem", marginBottom: "20px" }}>Order History</h3>

            {loadingOrders ? (
              <div className="skeleton" style={{ height: "200px" }} />
            ) : orders.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 20px" }}>
                <span style={{ fontSize: "2.5rem" }}>📦</span>
                <h4 style={{ margin: "12px 0 6px 0" }}>No Orders Yet</h4>
                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "16px" }}>
                  You haven't placed any orders on ShopEZ. Start shopping now!
                </p>
                <Link to="/products" className="btn btn-primary btn-sm">
                  Go Shopping
                </Link>
              </div>
            ) : (
              <div className="custom-table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Date</th>
                      <th>Total</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => {
                      let statusBadge = "badge-warning";
                      if (order.status === "Delivered") statusBadge = "badge-success";
                      else if (order.status === "Shipped") statusBadge = "badge-primary";
                      else if (order.status === "Cancelled") statusBadge = "badge-danger";

                      return (
                        <tr key={order._id}>
                          <td>
                            <Link to={`/order/${order._id}`} style={{ color: "var(--primary)", fontWeight: "700" }}>
                              #{order._id.substr(-6)}
                            </Link>
                          </td>
                          <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                          <td style={{ fontWeight: "700" }}>₹{order.totalAmount.toLocaleString("en-IN")}</td>
                          <td>
                            <span className={`badge ${statusBadge}`}>{order.status}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

      </div>

      <style>{`
        @media (max-width: 992px) {
          .profile-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

export default Profile;
