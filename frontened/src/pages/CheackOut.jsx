import React, { useEffect, useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { IoSearchOutline } from "react-icons/io5";
import { TbCurrentLocation } from "react-icons/tb";
import { IoLocationSharp } from "react-icons/io5";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import { useDispatch, useSelector } from "react-redux";
import "leaflet/dist/leaflet.css";
import { setAddress, setLocation } from "../redux/mapSlice";
import { MdDeliveryDining } from "react-icons/md";
import { FaCreditCard } from "react-icons/fa";
import axios from "axios";
import { FaMobileScreenButton } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../App";
import { addMyOrder } from "../redux/userSlice";
import { ClipLoader } from "react-spinners";

const css = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

.co {
  font-family: 'Inter', sans-serif;
  min-height: 100vh;
  background: #f8f8f9;
  padding-bottom: 80px;
}

/* ── Top bar ── */
.co-topbar {
  position: sticky; top: 0; z-index: 50;
  background: rgba(255,255,255,0.92);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(0,0,0,0.06);
  box-shadow: 0 1px 0 rgba(0,0,0,0.04);
  padding: 0 20px; height: 60px;
  display: flex; align-items: center; gap: 14px;
}
.co-back {
  width: 36px; height: 36px; border-radius: 10px;
  background: #f5f5f5; border: 1px solid #e5e5e5;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; color: #555; flex-shrink: 0;
  transition: all .15s;
}
.co-back:hover { background: #ececec; color: #111; transform: translateX(-2px); }
.co-topbar-title { font-size: 1rem; font-weight: 800; color: #111; letter-spacing: -0.3px; }
.co-topbar-steps {
  margin-left: auto; display: flex; align-items: center; gap: 6px;
}
.co-step {
  width: 24px; height: 4px; border-radius: 4px;
  background: #e5e5e5;
}
.co-step.active { background: linear-gradient(90deg, #1a3c2e, #2d6a4f); }

/* ── Layout ── */
.co-inner {
  max-width: 960px; margin: 0 auto;
  padding: 28px 20px 0;
  display: grid; gap: 20px;
  grid-template-columns: 1fr;
}
@media(min-width: 768px){
  .co-inner { grid-template-columns: 1fr 380px; align-items: start; }
}

/* ── Card ── */
.co-card {
  background: #fff; border-radius: 20px;
  border: 1px solid rgba(0,0,0,0.06);
  box-shadow: 0 2px 8px rgba(0,0,0,0.04), 0 8px 28px rgba(0,0,0,0.05);
  overflow: hidden;
}
.co-card-header {
  padding: 16px 20px; border-bottom: 1px solid #f5f5f5;
  display: flex; align-items: center; gap: 10px;
}
.co-card-header-icon {
  width: 34px; height: 34px; border-radius: 10px;
  background: rgba(26,60,46,0.08);
  display: flex; align-items: center; justify-content: center;
  color: #1a3c2e; flex-shrink: 0;
}
.co-card-header-title { font-size: 0.88rem; font-weight: 800; color: #111; margin: 0; letter-spacing: -0.2px; }
.co-card-body { padding: 18px 20px; }

/* ── Address input row ── */
.co-addr-row { display: flex; gap: 8px; margin-bottom: 14px; }
.co-addr-input {
  flex: 1; padding: 10px 14px;
  background: #f8f8f9; border: 1.5px solid #ececec;
  border-radius: 11px; font-size: 0.83rem; color: #111;
  font-family: 'Inter', sans-serif; outline: none;
  transition: border-color .2s, box-shadow .2s, background .2s;
}
.co-addr-input:focus {
  border-color: #1a3c2e;
  box-shadow: 0 0 0 3px rgba(26,60,46,0.08);
  background: #fff;
}
.co-addr-input::placeholder { color: #bbb; }
.co-addr-btn {
  width: 40px; height: 40px; border-radius: 11px;
  display: flex; align-items: center; justify-content: center;
  border: none; cursor: pointer; flex-shrink: 0;
  transition: all .15s;
}
.co-addr-btn.search { background: linear-gradient(135deg, #1a3c2e, #2d6a4f); color: #fff; box-shadow: 0 2px 8px rgba(26,60,46,0.25); }
.co-addr-btn.search:hover { transform: translateY(-1px); box-shadow: 0 4px 14px rgba(26,60,46,0.35); }
.co-addr-btn.locate { background: linear-gradient(135deg, #2563eb, #3b82f6); color: #fff; box-shadow: 0 2px 8px rgba(37,99,235,0.25); }
.co-addr-btn.locate:hover { transform: translateY(-1px); box-shadow: 0 4px 14px rgba(37,99,235,0.35); }

/* ── Map ── */
.co-map-wrap {
  border-radius: 14px; overflow: hidden;
  border: 1px solid rgba(0,0,0,0.06);
  height: 220px;
}
.co-map { width: 100%; height: 100%; }

/* ── Payment options ── */
.co-pay-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
@media(max-width: 480px){ .co-pay-grid { grid-template-columns: 1fr; } }

.co-pay-option {
  display: flex; align-items: center; gap: 10px;
  padding: 14px 14px; border-radius: 14px;
  border: 2px solid #ececec; cursor: pointer;
  background: #fafafa;
  transition: all .15s;
}
.co-pay-option:hover { border-color: #ccc; background: #f5f5f5; }
.co-pay-option.selected {
  border-color: #1a3c2e;
  background: rgba(26,60,46,0.04);
  box-shadow: 0 0 0 3px rgba(26,60,46,0.08);
}
.co-pay-icon-wrap {
  width: 38px; height: 38px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.co-pay-icon-wrap.green { background: #dcfce7; }
.co-pay-icon-wrap.purple { background: #f3e8ff; }
.co-pay-name { font-size: 0.8rem; font-weight: 700; color: #111; margin: 0 0 2px; }
.co-pay-desc { font-size: 0.68rem; color: #aaa; margin: 0; }
.co-pay-check {
  margin-left: auto; width: 18px; height: 18px; border-radius: 50%;
  border: 2px solid #e5e5e5; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  transition: all .15s;
}
.co-pay-option.selected .co-pay-check {
  background: #1a3c2e; border-color: #1a3c2e;
}
.co-pay-check-dot { width: 6px; height: 6px; border-radius: 50%; background: #fff; }

/* ── Order summary (right column) ── */
.co-summary { position: sticky; top: 80px; }
.co-summary-items { padding: 16px 20px; display: flex; flex-direction: column; gap: 10px; }
.co-summary-item {
  display: flex; align-items: center; justify-content: space-between; gap: 8px;
}
.co-summary-item-left { display: flex; align-items: center; gap: 8px; min-width: 0; }
.co-summary-item-img {
  width: 36px; height: 36px; border-radius: 8px;
  object-fit: cover; flex-shrink: 0;
  border: 1px solid #f0f0f0;
}
.co-summary-item-name {
  font-size: 0.78rem; font-weight: 600; color: #111;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.co-summary-item-qty { font-size: 0.68rem; color: #aaa; }
.co-summary-item-price { font-size: 0.78rem; font-weight: 700; color: #111; flex-shrink: 0; }

.co-bill { padding: 14px 20px; border-top: 1px solid #f5f5f5; display: flex; flex-direction: column; gap: 8px; }
.co-bill-row { display: flex; justify-content: space-between; align-items: center; }
.co-bill-label { font-size: 0.78rem; color: #888; }
.co-bill-val { font-size: 0.78rem; color: #111; font-weight: 600; }
.co-bill-val.free { color: #16a34a; }
.co-bill-divider { height: 1px; background: #f5f5f5; margin: 2px 0; }
.co-bill-total-row { display: flex; justify-content: space-between; align-items: center; padding-top: 8px; border-top: 1px solid #f0f0f0; }
.co-bill-total-label { font-size: 0.9rem; font-weight: 800; color: #111; }
.co-bill-total-val {
  font-size: 1.05rem; font-weight: 900;
  background: linear-gradient(135deg, #1a3c2e, #2d6a4f);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* ── Error ── */
.co-error {
  margin: 0 20px 4px;
  background: #fff5f5; border: 1px solid #fecaca;
  border-radius: 10px; padding: 10px 14px;
  font-size: 0.78rem; font-weight: 600; color: #dc2626;
  display: flex; align-items: center; gap: 6px;
}

/* ── Place order button ── */
.co-place-btn-wrap { padding: 16px 20px; border-top: 1px solid #f5f5f5; }
.co-place-btn {
  width: 100%; padding: 14px;
  background: linear-gradient(135deg, #1a3c2e, #2d6a4f);
  color: #fff; border: none; border-radius: 13px;
  font-size: 0.88rem; font-weight: 800; cursor: pointer;
  font-family: 'Inter', sans-serif; letter-spacing: -0.2px;
  box-shadow: 0 4px 16px rgba(26,60,46,0.3);
  display: flex; align-items: center; justify-content: center; gap: 8px;
  transition: all .15s;
}
.co-place-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 6px 24px rgba(26,60,46,0.42); }
.co-place-btn:disabled { opacity: .6; cursor: not-allowed; }
.co-place-note {
  text-align: center; font-size: 0.68rem; color: #bbb;
  margin-top: 8px;
}
`;

function RecenterMap({ location }) {
  if (location.lat && location.lon) {
    const map = useMap();
    map.setView([location.lat, location.lon], 16, { animate: true });
  }
  return null;
}

function CheckOut() {
  const { location, address } = useSelector((state) => state.map);
  const { cartItems, totalAmount, userData } = useSelector((state) => state.user);
  const [addressInput, setAddressInput] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderError, setOrderError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const apiKey = import.meta.env.VITE_GEOAPIKEY;

  const deliveryFee = totalAmount > 500 ? 0 : 40;
  const AmountWithDeliveryFee = totalAmount + deliveryFee;

  const onDragEnd = (e) => {
    const { lat, lng } = e.target._latlng;
    dispatch(setLocation({ lat, lon: lng }));
    getAddressByLatLng(lat, lng);
  };

  const getCurrentLocation = () => {
    const latitude = userData.location.coordinates[1];
    const longitude = userData.location.coordinates[0];
    dispatch(setLocation({ lat: latitude, lon: longitude }));
    getAddressByLatLng(latitude, longitude);
  };

  const getAddressByLatLng = async (lat, lng) => {
    try {
      const result = await axios.get(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&format=json&apiKey=${apiKey}`
      );
      dispatch(setAddress(result?.data?.results[0].address_line2));
    } catch (error) { console.log(error); }
  };

  const getLatLngByAddress = async () => {
    try {
      const result = await axios.get(
        `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(addressInput)}&apiKey=${apiKey}`
      );
      const { lat, lon } = result.data.features[0].properties;
      dispatch(setLocation({ lat, lon }));
    } catch (error) { console.log(error); }
  };

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) { setOrderError("Your cart is empty."); return; }
    if (!addressInput.trim()) { setOrderError("Please enter a delivery address."); return; }
    setOrderError("");
    setOrderLoading(true);
    try {
      const result = await axios.post(
        `${serverUrl}/api/order/place-order`,
        {
          paymentMethod,
          deliveryAddress: { text: addressInput, latitude: location.lat, longitude: location.lon },
          totalAmount: AmountWithDeliveryFee,
          cartItems,
        },
        { withCredentials: true }
      );
      if (paymentMethod === "cod") {
        dispatch(addMyOrder(result.data));
        navigate("/order-placed");
      } else {
        const orderId = result.data.orderId;
        const razorOrder = result.data.razorOrder;
        openRazorpayWindow(orderId, razorOrder);
      }
    } catch (error) {
      console.log(error);
      setOrderError("Something went wrong. Please try again.");
    } finally {
      setOrderLoading(false);
    }
  };

  const openRazorpayWindow = (orderId, razorOrder) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: razorOrder.amount,
      currency: "INR",
      name: "Vingo",
      description: "Food Delivery",
      order_id: razorOrder.id,
      handler: async function (response) {
        try {
          const result = await axios.post(
            `${serverUrl}/api/order/verify-payment`,
            { razorpay_payment_id: response.razorpay_payment_id, orderId },
            { withCredentials: true }
          );
          dispatch(addMyOrder(result.data));
          navigate("/order-placed");
        } catch (error) { console.log(error); }
      },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  useEffect(() => { setAddressInput(address); }, [address]);

  return (
    <>
      <style>{css}</style>
      <div className="co">

        {/* Top bar */}
        <div className="co-topbar">
          <div className="co-back" onClick={() => navigate("/")}>
            <IoIosArrowRoundBack size={20} />
          </div>
          <span className="co-topbar-title">Checkout</span>
          <div className="co-topbar-steps">
            <div className="co-step active" />
            <div className="co-step active" />
            <div className="co-step" />
          </div>
        </div>

        <div className="co-inner">

          {/* ── LEFT COLUMN ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Delivery location */}
            <div className="co-card">
              <div className="co-card-header">
                <div className="co-card-header-icon">
                  <IoLocationSharp size={17} />
                </div>
                <h2 className="co-card-header-title">Delivery Location</h2>
              </div>
              <div className="co-card-body">
                <div className="co-addr-row">
                  <input
                    type="text" className="co-addr-input"
                    placeholder="Enter your delivery address…"
                    value={addressInput}
                    onChange={e => setAddressInput(e.target.value)}
                  />
                  <button className="co-addr-btn search" onClick={getLatLngByAddress}>
                    <IoSearchOutline size={16} />
                  </button>
                  <button className="co-addr-btn locate" onClick={getCurrentLocation}>
                    <TbCurrentLocation size={16} />
                  </button>
                </div>
                <div className="co-map-wrap">
                  <MapContainer className="co-map" center={[location?.lat, location?.lon]} zoom={16}>
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <RecenterMap location={location} />
                    <Marker
                      position={[location?.lat, location?.lon]}
                      draggable
                      eventHandlers={{ dragend: onDragEnd }}
                    />
                  </MapContainer>
                </div>
              </div>
            </div>

            {/* Payment method */}
            <div className="co-card">
              <div className="co-card-header">
                <div className="co-card-header-icon">
                  <FaCreditCard size={15} />
                </div>
                <h2 className="co-card-header-title">Payment Method</h2>
              </div>
              <div className="co-card-body">
                <div className="co-pay-grid">
                  {/* COD */}
                  <div
                    className={"co-pay-option" + (paymentMethod === "cod" ? " selected" : "")}
                    onClick={() => setPaymentMethod("cod")}
                  >
                    <div className="co-pay-icon-wrap green">
                      <MdDeliveryDining size={20} style={{ color: '#16a34a' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p className="co-pay-name">Cash on Delivery</p>
                      <p className="co-pay-desc">Pay when food arrives</p>
                    </div>
                    <div className="co-pay-check">
                      {paymentMethod === "cod" && <div className="co-pay-check-dot" />}
                    </div>
                  </div>

                  {/* Online */}
                  <div
                    className={"co-pay-option" + (paymentMethod === "online" ? " selected" : "")}
                    onClick={() => setPaymentMethod("online")}
                  >
                    <div className="co-pay-icon-wrap purple">
                      <FaMobileScreenButton size={17} style={{ color: '#7c3aed' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p className="co-pay-name">UPI / Card</p>
                      <p className="co-pay-desc">Pay securely online</p>
                    </div>
                    <div className="co-pay-check">
                      {paymentMethod === "online" && <div className="co-pay-check-dot" />}
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* ── RIGHT COLUMN — Order Summary ── */}
          <div className="co-summary">
            <div className="co-card">
              <div className="co-card-header">
                <div className="co-card-header-icon" style={{ background: 'rgba(26,60,46,0.08)' }}>
                  <span style={{ fontSize: '1rem' }}>🧾</span>
                </div>
                <h2 className="co-card-header-title">Order Summary</h2>
              </div>

              {/* Items */}
              <div className="co-summary-items">
                {cartItems.map((item, index) => (
                  <div key={index} className="co-summary-item">
                    <div className="co-summary-item-left">
                      {item.image && (
                        <img src={item.image} alt={item.name} className="co-summary-item-img" />
                      )}
                      <div style={{ minWidth: 0 }}>
                        <p className="co-summary-item-name">{item.name}</p>
                        <p className="co-summary-item-qty">× {item.quantity}</p>
                      </div>
                    </div>
                    <span className="co-summary-item-price">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              {/* Bill */}
              <div className="co-bill">
                <div className="co-bill-row">
                  <span className="co-bill-label">Subtotal</span>
                  <span className="co-bill-val">₹{totalAmount}</span>
                </div>
                <div className="co-bill-row">
                  <span className="co-bill-label">Delivery Fee</span>
                  <span className={"co-bill-val" + (deliveryFee === 0 ? " free" : "")}>
                    {deliveryFee === 0 ? "FREE" : "₹" + deliveryFee}
                  </span>
                </div>
                <div className="co-bill-divider" />
                <div className="co-bill-total-row">
                  <span className="co-bill-total-label">Total</span>
                  <span className="co-bill-total-val">₹{AmountWithDeliveryFee}</span>
                </div>
              </div>

              {/* Error */}
              {orderError && (
                <div className="co-error">⚠ {orderError}</div>
              )}

              {/* Place order */}
              <div className="co-place-btn-wrap">
                <button className="co-place-btn" onClick={handlePlaceOrder} disabled={orderLoading}>
                  {orderLoading
                    ? <ClipLoader size={18} color="#fff" />
                    : paymentMethod === "cod"
                      ? "Place Order →"
                      : "Pay & Place Order →"
                  }
                </button>
                <p className="co-place-note">🔒 Secure & encrypted checkout</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default CheckOut;