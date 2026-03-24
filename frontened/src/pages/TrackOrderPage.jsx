import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { serverUrl } from "../App";
import { IoIosArrowRoundBack } from "react-icons/io";
import DeliveryBoyTracking from "../components/DileveryBoyTracking";
import { socket } from "../socket";
import {
  MdPhone,
  MdLocationOn,
  MdDeliveryDining,
  MdCheckCircle,
} from "react-icons/md";
import { FiPackage, FiClock } from "react-icons/fi";

const css = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

.to-page {
  font-family: 'Inter', sans-serif;
  min-height: 100vh;
  background: #f8f8f9;
  padding-bottom: 80px;
}

/* ── Topbar ── */
.to-topbar {
  position: sticky; top: 0; z-index: 50;
  background: rgba(255,255,255,0.92);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(0,0,0,0.06);
  box-shadow: 0 1px 0 rgba(0,0,0,0.04);
  padding: 0 20px; height: 60px;
  display: flex; align-items: center; gap: 14px;
}
.to-back {
  width: 36px; height: 36px; border-radius: 10px;
  background: #f5f5f5; border: 1px solid #e5e5e5;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; color: #555; flex-shrink: 0;
  transition: all .15s;
}
.to-back:hover { background: #ececec; color: #111; transform: translateX(-2px); }
.to-topbar-title { font-size: 1rem; font-weight: 800; color: #111; letter-spacing: -0.3px; }

/* ── Live badge ── */
.to-live-badge {
  margin-left: auto;
  display: flex; align-items: center; gap: 5px;
  background: rgba(34,197,94,0.1); color: #16a34a;
  border: 1px solid rgba(34,197,94,0.2);
  padding: 4px 12px; border-radius: 50px;
  font-size: 0.7rem; font-weight: 700;
}
.to-live-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: #22c55e;
  animation: livePulse 1.4s infinite;
}
@keyframes livePulse {
  0%,100%{ opacity: 1; } 50%{ opacity: .4; }
}

/* ── Inner ── */
.to-inner {
  max-width: 780px; margin: 24px auto 0;
  padding: 0 20px; display: flex; flex-direction: column; gap: 18px;
}

/* ── Order card ── */
.to-card {
  background: #fff; border-radius: 22px;
  border: 1px solid rgba(0,0,0,0.06);
  box-shadow: 0 2px 8px rgba(0,0,0,0.04), 0 8px 28px rgba(0,0,0,0.06);
  overflow: hidden;
}

/* ── Card header ── */
.to-card-head {
  padding: 14px 20px;
  background: linear-gradient(135deg, #1a3c2e 0%, #2d6a4f 100%);
  display: flex; align-items: center; justify-content: space-between;
}
.to-shop-name {
  font-size: 0.92rem; font-weight: 800; color: #fff;
  letter-spacing: -0.2px; margin: 0;
}
.to-status-pill {
  padding: 4px 12px; border-radius: 50px;
  font-size: 0.68rem; font-weight: 800; text-transform: capitalize;
  border: 1px solid;
}
.to-status-pill.delivered {
  background: rgba(34,197,94,0.2); color: #4ade80;
  border-color: rgba(34,197,94,0.3);
}
.to-status-pill.pending {
  background: rgba(251,191,36,0.2); color: #fbbf24;
  border-color: rgba(251,191,36,0.3);
}
.to-status-pill.preparing {
  background: rgba(96,165,250,0.2); color: #93c5fd;
  border-color: rgba(96,165,250,0.3);
}
.to-status-pill.outdelivery {
  background: rgba(255,200,0,0.2); color: #ffc800;
  border-color: rgba(255,200,0,0.3);
}

/* ── Card body ── */
.to-card-body { padding: 16px 20px; display: flex; flex-direction: column; gap: 12px; }

/* ── Info rows ── */
.to-info-row {
  display: flex; align-items: flex-start; gap: 8px;
  font-size: 0.8rem; color: #555;
}
.to-info-icon { flex-shrink: 0; margin-top: 2px; color: #1a3c2e; }
.to-info-label { font-weight: 700; color: #111; }

/* ── Items chips ── */
.to-items-wrap { display: flex; flex-wrap: wrap; gap: 6px; }
.to-item-chip {
  background: #f5f5f5; border: 1px solid #ececec;
  padding: 4px 10px; border-radius: 8px;
  font-size: 0.72rem; font-weight: 600; color: #555;
}

/* ── Subtotal row ── */
.to-subtotal-row {
  display: flex; align-items: center; justify-content: space-between;
  padding: 10px 14px; background: rgba(26,60,46,0.04);
  border-radius: 12px; border: 1px solid rgba(26,60,46,0.08);
}
.to-subtotal-label { font-size: 0.78rem; font-weight: 600; color: #666; }
.to-subtotal-val {
  font-size: 0.92rem; font-weight: 800;
  background: linear-gradient(135deg, #1a3c2e, #2d6a4f);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* ── Divider ── */
.to-sep { height: 1px; background: #f5f5f5; }

/* ── Delivery boy card ── */
.to-boy-card {
  display: flex; align-items: center; gap: 12px;
  background: #fafafa; border-radius: 14px; padding: 12px 14px;
  border: 1px solid rgba(0,0,0,0.05);
}
.to-boy-avatar {
  width: 42px; height: 42px; border-radius: 12px;
  background: linear-gradient(135deg, #1a3c2e, #2d6a4f);
  display: flex; align-items: center; justify-content: center;
  color: #ffc800; font-size: 1rem; font-weight: 800; flex-shrink: 0;
}
.to-boy-name { font-size: 0.85rem; font-weight: 800; color: #111; margin: 0 0 3px; }
.to-boy-phone {
  display: flex; align-items: center; gap: 4px;
  font-size: 0.74rem; color: #888; font-weight: 500;
}

/* ── Not assigned ── */
.to-not-assigned {
  display: flex; align-items: center; gap: 8px;
  background: #fefce8; border: 1px solid #fef08a;
  border-radius: 12px; padding: 11px 14px;
  font-size: 0.78rem; font-weight: 600; color: #854d0e;
}

/* ── Delivered banner ── */
.to-delivered-banner {
  display: flex; align-items: center; gap: 10px;
  background: #dcfce7; border: 1px solid #bbf7d0;
  border-radius: 14px; padding: 14px 16px;
}
.to-delivered-icon { color: #16a34a; flex-shrink: 0; }
.to-delivered-title { font-size: 0.88rem; font-weight: 800; color: #15803d; margin: 0 0 2px; }
.to-delivered-sub { font-size: 0.72rem; color: #16a34a; margin: 0; }

/* ── Map wrap ── */
.to-map-wrap {
  border-radius: 16px; overflow: hidden;
  border: 1px solid rgba(0,0,0,0.06);
}

/* ── Skeleton ── */
.to-skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
  border-radius: 22px;
}
.to-skeleton-card { height: 200px; }
@keyframes shimmer {
  0%{ background-position: 200% 0; }
  100%{ background-position: -200% 0; }
}
`;

function TrackOrderPage() {
  const { orderId } = useParams();
  const [currentOrder, setCurrentOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liveLocations, setLiveLocations] = useState({});
  const navigate = useNavigate();

  const handleGetOrder = async () => {
    setLoading(true);
    try {
      const result = await axios.get(
        `${serverUrl}/api/order/get-order-by-id/${orderId}`,
        { withCredentials: true },
      );
      setCurrentOrder(result.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    socket.on(
      "updateDeliveryLocation",
      ({ deliveryBoyId, latitude, longitude }) => {
        setLiveLocations((prev) => ({
          ...prev,
          [deliveryBoyId]: { lat: latitude, lon: longitude },
        }));
      },
    );
  }, [socket]);

  useEffect(() => {
    handleGetOrder();
  }, [orderId]);

  const getStatusClass = (status) => {
    if (status === "delivered") return "delivered";
    if (status === "preparing") return "preparing";
    if (status === "out of delivery") return "outdelivery";
    return "pending";
  };

  return (
    <>
      <style>{css}</style>
      <div className="to-page">
        {/* Topbar */}
        <div className="to-topbar">
          <div className="to-back" onClick={() => navigate("/")}>
            <IoIosArrowRoundBack size={20} />
          </div>
          <span className="to-topbar-title">Track Order</span>
          <div className="to-live-badge">
            <div className="to-live-dot" /> Live
          </div>
        </div>

        <div className="to-inner">
          {/* Skeleton */}
          {loading && (
            <>
              <div className="to-skeleton to-skeleton-card" />
              <div className="to-skeleton to-skeleton-card" />
            </>
          )}

          {/* Orders */}
          {!loading &&
            currentOrder?.shopOrders?.map((shopOrder, index) => {
              const isDelivered = shopOrder.status === "delivered";
              const hasDeliveryBoy = !!shopOrder.assignedDeliveryBoy;
              const deliveryBoyId = shopOrder.assignedDeliveryBoy?._id;
              const statusClass = getStatusClass(shopOrder.status);

              return (
                <div className="to-card" key={index}>
                  {/* Card header */}
                  <div className="to-card-head">
                    <p className="to-shop-name">{shopOrder.shop.name}</p>
                    <span className={"to-status-pill " + statusClass}>
                      {shopOrder.status}
                    </span>
                  </div>

                  <div className="to-card-body">
                    {/* Items */}
                    <div className="to-info-row">
                      <FiPackage className="to-info-icon" size={15} />
                      <div>
                        <div
                          className="to-info-label"
                          style={{ marginBottom: "6px" }}
                        >
                          Order Items
                        </div>
                        <div className="to-items-wrap">
                          {shopOrder.shopOrderItems?.map((item, i) => (
                            <span key={i} className="to-item-chip">
                              {item.name} ×{item.quantity}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Delivery address */}
                    <div className="to-info-row">
                      <MdLocationOn className="to-info-icon" size={16} />
                      <div>
                        <span className="to-info-label">Delivery Address</span>
                        <div style={{ marginTop: "2px" }}>
                          {currentOrder.deliveryAddress?.text}
                        </div>
                      </div>
                    </div>

                    {/* Subtotal */}
                    <div className="to-subtotal-row">
                      <span className="to-subtotal-label">Order Subtotal</span>
                      <span className="to-subtotal-val">
                        ₹{shopOrder.subtotal}
                      </span>
                    </div>

                    <div className="to-sep" />

                    {/* Delivered state */}
                    {isDelivered ? (
                      <div className="to-delivered-banner">
                        <MdCheckCircle
                          className="to-delivered-icon"
                          size={26}
                        />
                        <div>
                          <p className="to-delivered-title">Order Delivered!</p>
                          <p className="to-delivered-sub">
                            Your order was delivered successfully. Enjoy your
                            meal! 🍽
                          </p>
                        </div>
                      </div>
                    ) : (
                      <>
                        {/* Delivery boy info */}
                        {hasDeliveryBoy ? (
                          <div className="to-boy-card">
                            <div className="to-boy-avatar">
                              {shopOrder.assignedDeliveryBoy.fullName
                                .slice(0, 1)
                                .toUpperCase()}
                            </div>
                            <div>
                              <p className="to-boy-name">
                                {shopOrder.assignedDeliveryBoy.fullName}
                              </p>
                              <div className="to-boy-phone">
                                <MdPhone size={13} />
                                {shopOrder.assignedDeliveryBoy.mobile}
                              </div>
                            </div>
                            <div style={{ marginLeft: "auto" }}>
                              <MdDeliveryDining
                                size={24}
                                style={{ color: "#1a3c2e" }}
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="to-not-assigned">
                            <FiClock size={16} />
                            Finding a delivery partner for your order…
                          </div>
                        )}

                        {/* Live map */}
                        {hasDeliveryBoy && (
                          <div className="to-map-wrap">
                            <DeliveryBoyTracking
                              data={{
                                deliveryBoyLocation: liveLocations[
                                  deliveryBoyId
                                ] || {
                                  lat: shopOrder.assignedDeliveryBoy.location
                                    .coordinates[1],
                                  lon: shopOrder.assignedDeliveryBoy.location
                                    .coordinates[0],
                                },
                                customerLocation: {
                                  lat: currentOrder.deliveryAddress.latitude,
                                  lon: currentOrder.deliveryAddress.longitude,
                                },
                              }}
                            />
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
}

export default TrackOrderPage;
