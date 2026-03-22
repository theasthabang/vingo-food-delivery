import React, { useEffect, useState } from "react";
import Nav from "./Nav";
import { useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";
import DeliveryBoyTracking from "./DileveryBoyTracking";
import { ClipLoader } from "react-spinners";
import { socket } from "../socket";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const css = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
.db {
  font-family: 'Inter', sans-serif;
  width: 100vw; min-height: 100vh;
  background: #f8f8f9;
  padding-top: 64px; padding-bottom: 80px;
  display: flex; flex-direction: column;
  align-items: center; overflow-x: hidden;
}
.db-inner {
  width: 100%; max-width: 680px;
  padding: 24px 20px 0;
  display: flex; flex-direction: column; gap: 16px;
}

/* Welcome */
.db-welcome {
  border-radius: 22px; overflow: hidden; position: relative;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  padding: 26px 24px;
}
.db-wc1 { position:absolute; right:-40px; top:-40px; width:180px; height:180px; border-radius:50%; background:rgba(255,77,45,0.1); }
.db-wc2 { position:absolute; left:-20px; bottom:-50px; width:140px; height:140px; border-radius:50%; background:rgba(255,255,255,0.03); }
.db-welcome-name { font-size:1.15rem; font-weight:800; color:#fff; margin:0 0 10px; position:relative; z-index:1; letter-spacing:-0.3px; }
.db-coord-row { display:flex; gap:8px; flex-wrap:wrap; position:relative; z-index:1; }
.db-coord-chip {
  display:flex; align-items:center; gap:5px;
  background:rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.12);
  color:rgba(255,255,255,0.8); padding:5px 12px; border-radius:50px;
  font-size:0.72rem; font-weight:600; backdrop-filter:blur(8px);
}
.db-coord-lbl { color:rgba(255,255,255,0.5); font-weight:500; }

/* Card */
.db-card {
  background:#fff; border-radius:18px;
  border:1px solid rgba(0,0,0,0.06);
  box-shadow:0 2px 8px rgba(0,0,0,0.04), 0 8px 28px rgba(0,0,0,0.06);
  padding:18px 20px; transition:box-shadow .2s;
}
.db-card:hover { box-shadow:0 4px 12px rgba(0,0,0,0.05), 0 12px 40px rgba(0,0,0,0.08); }
.db-card-title {
  font-size:0.88rem; font-weight:800; color:#111; margin:0 0 16px;
  display:flex; align-items:center; gap:7px; letter-spacing:-0.2px;
}
.db-card-title::before { content:''; width:3px; height:14px; border-radius:4px; background:linear-gradient(180deg,#ff4d2d,#ff7a00); display:block; }

/* Earnings strip */
.db-earn {
  display:flex; align-items:center; justify-content:space-between;
  background:linear-gradient(135deg, #f8f8f9, #fff8f6);
  border-radius:14px; padding:14px 16px; margin-top:14px;
  border:1px solid rgba(0,0,0,0.05);
}
.db-earn-lbl { font-size:0.76rem; font-weight:600; color:#888; }
.db-earn-val { font-size:1.55rem; font-weight:800; color:#16a34a; line-height:1; }
.db-earn-sub { font-size:0.65rem; color:#bbb; margin-top:2px; }

/* Assignment list */
.db-assign-list { display:flex; flex-direction:column; gap:10px; }
.db-assign-item {
  display:flex; align-items:center; justify-content:space-between;
  gap:12px; background:#fafafa; border-radius:14px;
  border:1px solid rgba(0,0,0,0.05); padding:13px 14px;
  transition:transform .15s, box-shadow .15s;
}
.db-assign-item:hover { transform:translateY(-2px); box-shadow:0 4px 16px rgba(255,77,45,0.08); }
.db-assign-shop { font-size:0.84rem; font-weight:700; color:#111; margin:0 0 4px; letter-spacing:-0.2px; }
.db-assign-addr { font-size:0.74rem; color:#777; margin:0 0 6px; line-height:1.4; }
.db-assign-chips { display:flex; gap:5px; }
.db-assign-chip {
  background:#f0f0f0; border:1px solid #e8e8e8;
  padding:3px 8px; border-radius:6px;
  font-size:0.65rem; font-weight:600; color:#666;
}
.db-accept-btn {
  background:linear-gradient(135deg,#ff4d2d,#ff7a00); color:#fff;
  padding:9px 16px; border-radius:10px; font-size:0.76rem; font-weight:700;
  cursor:pointer; border:none; font-family:'Inter',sans-serif;
  box-shadow:0 2px 8px rgba(255,77,45,0.3); white-space:nowrap; flex-shrink:0;
  transition:all .15s;
}
.db-accept-btn:hover { transform:translateY(-1px); box-shadow:0 4px 14px rgba(255,77,45,0.42); }
.db-empty-msg { text-align:center; font-size:0.8rem; color:#ccc; padding:28px 0; }

/* Current order */
.db-current-tile {
  background:linear-gradient(135deg, #fff8f6, #fff3ee);
  border-radius:14px; padding:13px 14px; margin-bottom:14px;
  border:1px solid rgba(255,77,45,0.1);
}
.db-current-shop { font-size:0.88rem; font-weight:800; color:#ff4d2d; margin:0 0 4px; }
.db-current-addr { font-size:0.76rem; color:#666; margin:0 0 6px; line-height:1.4; }
.db-current-chips { display:flex; gap:5px; }
.db-current-chip { background:rgba(255,77,45,0.08); border:1px solid rgba(255,77,45,0.12); padding:3px 8px; border-radius:6px; font-size:0.65rem; font-weight:700; color:#ff4d2d; }

/* Deliver btn */
.db-deliver-btn {
  margin-top:14px; width:100%;
  background:linear-gradient(135deg,#16a34a,#15803d); color:#fff;
  padding:13px; border-radius:12px; font-size:0.84rem; font-weight:700;
  cursor:pointer; border:none; font-family:'Inter',sans-serif;
  box-shadow:0 4px 14px rgba(34,197,94,0.3);
  display:flex; align-items:center; justify-content:center; gap:8px;
  transition:all .15s;
}
.db-deliver-btn:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 6px 22px rgba(34,197,94,0.42); }
.db-deliver-btn:disabled { opacity:.6; cursor:not-allowed; }

/* OTP */
.db-otp-box {
  margin-top:14px; background:#fafafa; border-radius:16px;
  padding:18px 16px; border:1px solid rgba(0,0,0,0.06);
}
.db-otp-lbl { font-size:0.8rem; font-weight:600; color:#555; margin:0 0 12px; line-height:1.5; }
.db-otp-name { color:#ff4d2d; font-weight:800; }
.db-otp-input {
  width:100%; border:2px solid #e8e8e8; border-radius:12px;
  padding:12px 16px; font-size:1.3rem; font-family:'Inter',sans-serif;
  outline:none; letter-spacing:10px; text-align:center;
  color:#111; font-weight:800; background:#fff;
  transition:border-color .2s, box-shadow .2s;
}
.db-otp-input:focus { border-color:#ff4d2d; box-shadow:0 0 0 4px rgba(255,77,45,0.08); }
.db-otp-error { font-size:0.76rem; color:#ef4444; margin:8px 0 0; display:flex; align-items:center; gap:4px; }
.db-otp-success { font-size:0.8rem; color:#16a34a; font-weight:700; text-align:center; margin:8px 0 0; }
.db-otp-submit {
  margin-top:12px; width:100%;
  background:linear-gradient(135deg,#ff4d2d,#ff7a00); color:#fff;
  padding:12px; border-radius:11px; font-size:0.84rem; font-weight:700;
  cursor:pointer; border:none; font-family:'Inter',sans-serif;
  box-shadow:0 3px 10px rgba(255,77,45,0.3); transition:all .15s;
}
.db-otp-submit:hover { transform:translateY(-1px); box-shadow:0 5px 18px rgba(255,77,45,0.42); }
`;

function DeliveryBoy() {
  const { userData } = useSelector(s => s.user);
  const [currentOrder, setCurrentOrder] = useState();
  const [showOtpBox, setShowOtpBox] = useState(false);
  const [availableAssignments, setAvailableAssignments] = useState(null);
  const [otp, setOtp] = useState("");
  const [todayDeliveries, setTodayDeliveries] = useState([]);
  const [deliveryBoyLocation, setDeliveryBoyLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [otpError, setOtpError] = useState("");

  useEffect(() => {
    if (!socket || userData.role !== "deliveryBoy") return;
    let watchId;
    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        pos => {
          const lat = pos.coords.latitude, lon = pos.coords.longitude;
          setDeliveryBoyLocation({ lat, lon });
          socket.emit("updateLocation", { latitude: lat, longitude: lon, userId: userData._id });
        },
        err => console.log(err),
        { enableHighAccuracy: true }
      );
    }
    return () => { if (watchId) navigator.geolocation.clearWatch(watchId); };
  }, [socket, userData]);

  const ratePerDelivery = 50;
  const totalEarning = todayDeliveries.reduce((s, d) => s + d.count * ratePerDelivery, 0);
  const totalCount = todayDeliveries.reduce((s, d) => s + d.count, 0);

  const getAssignments = async () => {
    try { const r = await axios.get(`${serverUrl}/api/order/get-assignments`, { withCredentials: true }); setAvailableAssignments(r.data); }
    catch (e) { console.log(e); }
  };
  const getCurrentOrder = async () => {
    try { const r = await axios.get(`${serverUrl}/api/order/get-current-order`, { withCredentials: true }); setCurrentOrder(r.data); }
    catch (e) { console.log(e); }
  };
  const acceptOrder = async (id) => {
    try { await axios.get(`${serverUrl}/api/order/accept-order/${id}`, { withCredentials: true }); await getCurrentOrder(); }
    catch (e) { console.log(e); }
  };
  const sendOtp = async () => {
    setLoading(true);
    try {
      await axios.post(`${serverUrl}/api/order/send-delivery-otp`, { orderId: currentOrder._id, shopOrderId: currentOrder.shopOrder._id }, { withCredentials: true });
      setLoading(false); setShowOtpBox(true);
    } catch (e) { console.log(e); setLoading(false); }
  };
  const verifyOtp = async () => {
    setMessage(""); setOtpError("");
    try {
      const r = await axios.post(`${serverUrl}/api/order/verify-delivery-otp`, { orderId: currentOrder._id, shopOrderId: currentOrder.shopOrder._id, otp }, { withCredentials: true });
      setMessage(r.data.message); location.reload();
    } catch (e) { setOtpError(e?.response?.data?.message || "Something went wrong."); }
  };
  const handleTodayDeliveries = async () => {
    try { const r = await axios.get(`${serverUrl}/api/order/get-today-deliveries`, { withCredentials: true }); setTodayDeliveries(r.data); }
    catch (e) { console.log(e); }
  };

  useEffect(() => {
    if (!socket) return;
    socket.on("newAssignment", d => setAvailableAssignments(p => [...p, d]));
    return () => { socket.off("newAssignment"); };
  }, [socket]);

  useEffect(() => { getAssignments(); getCurrentOrder(); handleTodayDeliveries(); }, [userData]);

  const latStr = deliveryBoyLocation ? String(deliveryBoyLocation.lat).slice(0, 8) : "—";
  const lonStr = deliveryBoyLocation ? String(deliveryBoyLocation.lon).slice(0, 8) : "—";

  return (
    <>
      <style>{css}</style>
      <div className="db">
        <Nav />
        <div className="db-inner">

          {/* Welcome card */}
          <div className="db-welcome">
            <div className="db-wc1" /><div className="db-wc2" />
            <p className="db-welcome-name">Welcome back, {userData.fullName} 👋</p>
            <div className="db-coord-row">
              <div className="db-coord-chip"><span className="db-coord-lbl">Lat</span>{latStr}</div>
              <div className="db-coord-chip"><span className="db-coord-lbl">Lon</span>{lonStr}</div>
            </div>
          </div>

          {/* Chart card */}
          <div className="db-card">
            <h2 className="db-card-title">Today's Activity</h2>
            <ResponsiveContainer width="100%" height={175}>
              <BarChart data={todayDeliveries} margin={{ top: 0, right: 0, left: -22, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="hour" tickFormatter={h => h + ":00"} tick={{ fontSize: 10, fill: '#ccc', fontFamily: 'Inter' }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: '#ccc', fontFamily: 'Inter' }} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={v => [v, "orders"]}
                  labelFormatter={l => l + ":00"}
                  contentStyle={{ borderRadius: '12px', border: '1px solid rgba(0,0,0,0.08)', fontSize: '0.75rem', fontFamily: 'Inter', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}
                  cursor={{ fill: 'rgba(255,77,45,0.04)' }}
                />
                <Bar dataKey="count" fill="url(#dbGrad)" radius={[6, 6, 0, 0]} />
                <defs>
                  <linearGradient id="dbGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ff4d2d" />
                    <stop offset="100%" stopColor="#ff8c00" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
            <div className="db-earn">
              <span className="db-earn-lbl">Today's Earnings</span>
              <div>
                <div className="db-earn-val">₹{totalEarning}</div>
                <div className="db-earn-sub">{totalCount} deliveries × ₹{ratePerDelivery}</div>
              </div>
            </div>
          </div>

          {/* Available orders */}
          {!currentOrder && (
            <div className="db-card">
              <h2 className="db-card-title">Available Orders</h2>
              <div className="db-assign-list">
                {availableAssignments && availableAssignments.length > 0 ? (
                  availableAssignments.map((a, i) => (
                    <div key={i} className="db-assign-item">
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p className="db-assign-shop">{a.shopName}</p>
                        <p className="db-assign-addr">{a.deliveryAddress.text}</p>
                        <div className="db-assign-chips">
                          <span className="db-assign-chip">{a.items.length} items</span>
                          <span className="db-assign-chip">₹{a.subtotal}</span>
                        </div>
                      </div>
                      <button className="db-accept-btn" onClick={() => acceptOrder(a.assignmentId)}>Accept</button>
                    </div>
                  ))
                ) : (
                  <p className="db-empty-msg">No orders available right now</p>
                )}
              </div>
            </div>
          )}

          {/* Current order */}
          {currentOrder && (
            <div className="db-card">
              <h2 className="db-card-title" style={{ '--title-color': '#16a34a' }}>Current Order</h2>
              <div className="db-current-tile">
                <p className="db-current-shop">{currentOrder.shopOrder.shop.name}</p>
                <p className="db-current-addr">{currentOrder.deliveryAddress.text}</p>
                <div className="db-current-chips">
                  <span className="db-current-chip">{currentOrder.shopOrder.shopOrderItems.length} items</span>
                  <span className="db-current-chip">₹{currentOrder.shopOrder.subtotal}</span>
                </div>
              </div>

              <DeliveryBoyTracking
                data={{
                  deliveryBoyLocation: deliveryBoyLocation || { lat: userData.location.coordinates[1], lon: userData.location.coordinates[0] },
                  customerLocation: { lat: currentOrder.deliveryAddress.latitude, lon: currentOrder.deliveryAddress.longitude },
                }}
              />

              {!showOtpBox ? (
                <button className="db-deliver-btn" onClick={sendOtp} disabled={loading}>
                  {loading ? <ClipLoader size={16} color="#fff" /> : <><span>✓</span> Mark as Delivered</>}
                </button>
              ) : (
                <div className="db-otp-box">
                  <p className="db-otp-lbl">Enter OTP sent to <span className="db-otp-name">{currentOrder.user.fullName}</span></p>
                  <input type="text" className="db-otp-input" placeholder="· · · · · ·" onChange={e => setOtp(e.target.value)} value={otp} maxLength={6} />
                  {otpError && <p className="db-otp-error">⚠ {otpError}</p>}
                  {message && <p className="db-otp-success">✓ {message}</p>}
                  <button className="db-otp-submit" onClick={verifyOtp}>Verify & Complete Delivery</button>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </>
  );
}

export default DeliveryBoy;