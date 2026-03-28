import axios from "axios";
import React, { useState } from "react";
import { MdPhone } from "react-icons/md";
import { serverUrl } from "../App";
import { useDispatch } from "react-redux";
import { updateOrderStatus } from "../redux/userSlice";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

  .oorder-card {
    font-family: 'DM Sans', sans-serif;
    background: #fff;
    border-radius: 20px;
    box-shadow: 0 2px 18px rgba(0,0,0,0.07);
    border: 1px solid #f5f5f5;
    overflow: hidden;
    transition: box-shadow .2s;
  }
  .oorder-card:hover { box-shadow: 0 6px 30px rgba(0,0,0,0.1); }

  /* Top bar */
  .oorder-topbar {
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 18px;
    background: rgba(255,77,45,0.04);
    border-bottom: 1px solid #f5f5f5;
  }
  .oorder-customer-name {
    font-size: 0.95rem; font-weight: 700; color: #1a1a1a; margin: 0 0 2px;
  }
  .oorder-customer-email {
    font-size: 0.75rem; color: #aaa; margin: 0;
  }
  .oorder-status-chip {
    padding: 4px 12px; border-radius: 50px;
    font-size: 0.72rem; font-weight: 700;
    background: rgba(255,77,45,0.1); color: #ff4d2d;
    text-transform: capitalize; white-space: nowrap;
  }

  /* Body */
  .oorder-body { padding: 14px 18px; display: flex; flex-direction: column; gap: 12px; }

  .oorder-row {
    display: flex; align-items: flex-start; gap: 8px;
    font-size: 0.82rem; color: #555;
  }
  .oorder-row-icon { flex-shrink: 0; margin-top: 1px; }

  .oorder-address { font-size: 0.82rem; color: #555; line-height: 1.5; }
  .oorder-address-coords { font-size: 0.72rem; color: #bbb; margin-top: 2px; }

  .oorder-payment-tag {
    display: inline-flex; align-items: center;
    padding: 3px 10px; border-radius: 6px;
    font-size: 0.73rem; font-weight: 600;
    background: #f5f5f5; color: #666;
  }
  .oorder-payment-tag.success { background: #dcfce7; color: #16a34a; }
  .oorder-payment-tag.pending { background: #fef3c7; color: #d97706; }

  /* Items scroll */
  .oorder-items-scroll {
    display: flex; gap: 10px; overflow-x: auto;
    padding-bottom: 6px; scrollbar-width: thin;
  }
  .oorder-item-tile {
    flex-shrink: 0; width: 130px;
    border-radius: 14px; overflow: hidden;
    border: 1px solid #f0f0f0; background: #fafafa;
  }
  .oorder-item-img {
    width: 100%; height: 90px; object-fit: cover; display: block;
  }
  .oorder-item-info { padding: 7px 9px; }
  .oorder-item-name {
    font-size: 0.78rem; font-weight: 600; color: #1a1a1a;
    margin: 0 0 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .oorder-item-qty { font-size: 0.72rem; color: #aaa; margin: 0; }

  /* Footer */
  .oorder-footer {
    display: flex; align-items: center; justify-content: space-between;
    padding: 12px 18px; border-top: 1px solid #f5f5f5;
    flex-wrap: wrap; gap: 10px;
  }
  .oorder-total {
    font-size: 0.92rem; font-weight: 800; color: #1a1a1a;
  }

  .oorder-select {
    border: 1.5px solid #ff4d2d; border-radius: 10px;
    padding: 6px 10px; font-size: 0.8rem; font-weight: 600;
    color: #ff4d2d; background: transparent; outline: none;
    cursor: pointer; font-family: 'DM Sans', sans-serif;
    transition: background .15s;
  }
  .oorder-select:hover { background: rgba(255,77,45,0.05); }

  /* Delivery boys panel */
  .oorder-delivery-panel {
    margin: 0 18px 14px;
    background: #fff8f6; border-radius: 14px;
    padding: 12px 14px; border: 1px solid rgba(255,77,45,0.12);
  }
  .oorder-delivery-label {
    font-size: 0.78rem; font-weight: 700; color: #ff4d2d; margin: 0 0 8px;
    text-transform: uppercase; letter-spacing: 0.4px;
  }
  .oorder-delivery-boy {
    font-size: 0.82rem; color: #444; padding: 4px 0;
    display: flex; align-items: center; gap: 6px;
  }
  .oorder-delivery-waiting {
    font-size: 0.8rem; color: #aaa; font-style: italic;
  }
`;

function OwnerOrderCard({ data }) {
  const [availableBoys, setAvailableBoys] = useState([]);
  const dispatch = useDispatch();

  const handleUpdateStatus = async (orderId, shopId, status) => {
    try {
      const result = await axios.post(
        `${serverUrl}/api/order/update-status/${orderId}/${shopId}`,
        { status },
        { withCredentials: true }
      );
      dispatch(updateOrderStatus({ orderId, shopId, status }));
      setAvailableBoys(result.data.availableBoys);
      console.log(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="oorder-card">

        {/* Top bar */}
        <div className="oorder-topbar">
          <div>
            <p className="oorder-customer-name">{data.user.fullName}</p>
            <p className="oorder-customer-email">{data.user.email}</p>
          </div>
          <span className="oorder-status-chip">{data.shopOrders.status}</span>
        </div>

        <div className="oorder-body">
          {/* Phone */}
          <div className="oorder-row">
            <MdPhone className="oorder-row-icon" style={{ color: '#ff4d2d' }} size={15} />
            <span>{data.user.mobile}</span>
          </div>

          {/* Payment */}
          <div>
            {data.paymentMethod === "online" ? (
              <span className={`oorder-payment-tag ${data.payment ? 'success' : 'pending'}`}>
                Online · {data.payment ? "Paid" : "Unpaid"}
              </span>
            ) : (
              <span className="oorder-payment-tag">
                {data.paymentMethod?.toUpperCase()}
              </span>
            )}
          </div>

          {/* Address */}
          <div>
            <p className="oorder-address">{data?.deliveryAddress?.text}</p>
            <p className="oorder-address-coords">
              {data?.deliveryAddress?.latitude}, {data?.deliveryAddress?.longitude}
            </p>
          </div>

          {/* Items */}
          <div className="oorder-items-scroll">
            {data.shopOrders.shopOrderItems.map((item, index) => (
              <div key={index} className="oorder-item-tile">
                <img src={item.item.image} alt={item.name} className="oorder-item-img" />
                <div className="oorder-item-info">
                  <p className="oorder-item-name">{item.name}</p>
                  <p className="oorder-item-qty">Qty {item.quantity} · ₹{item.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery boys panel */}
        {data.shopOrders.status === "out of delivery" && (
          <div className="oorder-delivery-panel">
            <p className="oorder-delivery-label">
              {data.shopOrders.assignedDeliveryBoy ? "Assigned Delivery Partner" : "Available Delivery Partners"}
            </p>
            {availableBoys?.length > 0 ? (
              availableBoys.map((b, i) => (
                <div key={i} className="oorder-delivery-boy">
                  <MdPhone size={13} style={{ color: '#ff4d2d' }} />
                  {b.fullName} — {b.mobile}
                </div>
              ))
            ) : data.shopOrders.assignedDeliveryBoy ? (
              <div className="oorder-delivery-boy">
                <MdPhone size={13} style={{ color: '#ff4d2d' }} />
                {data.shopOrders.assignedDeliveryBoy.fullName} — {data.shopOrders.assignedDeliveryBoy.mobile}
              </div>
            ) : (
              <p className="oorder-delivery-waiting">Waiting for a delivery partner to accept…</p>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="oorder-footer">
          <span className="oorder-total">Total: ₹{data.shopOrders.subtotal}</span>
          <select
            className="oorder-select"
            onChange={(e) => handleUpdateStatus(data._id, data.shopOrders.shop._id, e.target.value)}
          >
            <option value="">Update Status</option>
            <option value="pending">Pending</option>
            <option value="preparing">Preparing</option>
            <option value="out of delivery">Out of Delivery</option>
          </select>
        </div>
      </div>
    </>
  );
}

export default OwnerOrderCard;