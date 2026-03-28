import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { serverUrl } from '../App'

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

  .uorder-card {
    font-family: 'DM Sans', sans-serif;
    background: #fff;
    border-radius: 20px;
    box-shadow: 0 2px 18px rgba(0,0,0,0.07);
    border: 1px solid #f5f5f5;
    overflow: hidden;
    transition: box-shadow .2s, transform .2s;
  }
  .uorder-card:hover {
    box-shadow: 0 6px 32px rgba(0,0,0,0.1);
    transform: translateY(-2px);
  }

  /* Header */
  .uorder-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 18px;
    background: #fafafa;
    border-bottom: 1px solid #f0f0f0;
    flex-wrap: wrap; gap: 8px;
  }
  .uorder-id {
    font-size: 0.78rem; font-weight: 700; color: #1a1a1a;
    text-transform: uppercase; letter-spacing: 0.5px;
    margin: 0;
  }
  .uorder-date {
    font-size: 0.73rem; color: #aaa; margin: 2px 0 0;
  }
  .uorder-header-right { text-align: right; }
  .uorder-pay-tag {
    display: inline-block;
    padding: 3px 10px; border-radius: 6px;
    font-size: 0.7rem; font-weight: 700;
    background: #f5f5f5; color: #666;
    margin-bottom: 4px;
  }
  .uorder-status-tag {
    display: block;
    font-size: 0.75rem; font-weight: 700;
    color: #ff4d2d; text-transform: capitalize;
  }

  /* Body */
  .uorder-body { padding: 14px 18px; display: flex; flex-direction: column; gap: 14px; }

  /* Shop order block */
  .uorder-shop-block {
    background: #fafafa; border-radius: 14px;
    padding: 12px 14px; border: 1px solid #f0f0f0;
  }
  .uorder-shop-name {
    font-size: 0.82rem; font-weight: 700; color: #ff4d2d;
    margin: 0 0 10px;
  }

  /* Items scroll */
  .uorder-items-scroll {
    display: flex; gap: 10px; overflow-x: auto;
    padding-bottom: 4px; scrollbar-width: thin;
  }
  .uorder-item-tile {
    flex-shrink: 0; width: 125px;
    border-radius: 12px; overflow: hidden;
    border: 1px solid #efefef; background: #fff;
  }
  .uorder-item-img {
    width: 100%; height: 82px; object-fit: cover; display: block;
  }
  .uorder-item-info { padding: 6px 8px; }
  .uorder-item-name {
    font-size: 0.75rem; font-weight: 600; color: #1a1a1a;
    margin: 0 0 2px; white-space: nowrap;
    overflow: hidden; text-overflow: ellipsis;
  }
  .uorder-item-qty { font-size: 0.7rem; color: #aaa; margin: 0 0 5px; }

  /* Stars */
  .uorder-stars { display: flex; gap: 3px; }
  .uorder-star {
    background: none; border: none; cursor: pointer;
    font-size: 1.05rem; padding: 0; line-height: 1;
    transition: transform .1s;
  }
  .uorder-star:hover { transform: scale(1.2); }
  .uorder-star.filled { color: #f59e0b; }
  .uorder-star.empty { color: #ddd; }

  /* Shop subtotal */
  .uorder-shop-footer {
    display: flex; align-items: center; justify-content: space-between;
    margin-top: 10px; padding-top: 8px;
    border-top: 1px solid #f0f0f0;
  }
  .uorder-shop-subtotal {
    font-size: 0.8rem; font-weight: 700; color: #1a1a1a;
  }
  .uorder-shop-status {
    font-size: 0.75rem; font-weight: 600; color: #ff4d2d;
    text-transform: capitalize;
  }

  /* Footer */
  .uorder-footer {
    display: flex; align-items: center; justify-content: space-between;
    padding: 12px 18px; border-top: 1px solid #f5f5f5;
    flex-wrap: wrap; gap: 10px;
  }
  .uorder-total {
    font-size: 0.95rem; font-weight: 800; color: #1a1a1a;
  }
  .uorder-track-btn {
    background: #ff4d2d; color: #fff;
    padding: 9px 20px; border-radius: 50px;
    font-size: 0.82rem; font-weight: 600; cursor: pointer;
    border: none; font-family: 'DM Sans', sans-serif;
    box-shadow: 0 2px 12px rgba(255,77,45,0.28);
    transition: background .15s, transform .15s, box-shadow .15s;
  }
  .uorder-track-btn:hover {
    background: #e63e20; transform: translateY(-1px);
    box-shadow: 0 4px 18px rgba(255,77,45,0.36);
  }
`;

function UserOrderCard({ data }) {
  const navigate = useNavigate()
  const [selectedRating, setSelectedRating] = useState({})

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-GB', { day: "2-digit", month: "short", year: "numeric" })
  }

  const handleRating = async (itemId, rating) => {
    try {
      const result = await axios.post(`${serverUrl}/api/item/rating`, { itemId, rating }, { withCredentials: true })
      setSelectedRating(prev => ({ ...prev, [itemId]: rating }))
    } catch (error) {
      console.log(error)
    }
  }

  const firstOrderStatus = (data.shopOrders && data.shopOrders.length > 0) ? data.shopOrders[0].status : ""
  const paymentBg = data.payment ? '#dcfce7' : '#fef3c7'
  const paymentColor = data.payment ? '#16a34a' : '#d97706'
  const paymentLabel = data.payment ? "Paid" : "Unpaid"

  return (
    <>
      <style>{styles}</style>
      <div className="uorder-card">

        {/* Header */}
        <div className="uorder-header">
          <div>
            <p className="uorder-id">Order #{data._id.slice(-6)}</p>
            <p className="uorder-date">{formatDate(data.createdAt)}</p>
          </div>
          <div className="uorder-header-right">
            {data.paymentMethod === "cod"
              ? <span className="uorder-pay-tag">COD</span>
              : <span className="uorder-pay-tag" style={{ background: paymentBg, color: paymentColor }}>
                  {paymentLabel}
                </span>
            }
            <span className="uorder-status-tag">{firstOrderStatus}</span>
          </div>
        </div>

        {/* Shop orders */}
        <div className="uorder-body">
          {data.shopOrders.map((shopOrder, index) => (
            <div className="uorder-shop-block" key={index}>
              <p className="uorder-shop-name">{shopOrder.shop.name}</p>
              <div className="uorder-items-scroll">
                {shopOrder.shopOrderItems.map((item, idx) => (
                  <div key={idx} className="uorder-item-tile">
                    <img src={item.item.image} alt={item.name} className="uorder-item-img" />
                    <div className="uorder-item-info">
                      <p className="uorder-item-name">{item.name}</p>
                      <p className="uorder-item-qty">Qty {item.quantity} · ₹{item.price}</p>
                      {shopOrder.status === "delivered" && (
                        <div className="uorder-stars">
                          {[1, 2, 3, 4, 5].map((star) => {
                            const isFilled = selectedRating[item.item._id] >= star
                            const starClass = isFilled ? "uorder-star filled" : "uorder-star empty"
                            return (
                              <button
                                key={star}
                                className={starClass}
                                onClick={() => handleRating(item.item._id, star)}
                              >★</button>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="uorder-shop-footer">
                <span className="uorder-shop-subtotal">Subtotal: ₹{shopOrder.subtotal}</span>
                <span className="uorder-shop-status">{shopOrder.status}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="uorder-footer">
          <span className="uorder-total">Total: ₹{data.totalAmount}</span>
          <button className="uorder-track-btn" onClick={() => navigate(`/track-order/${data._id}`)}>
            Track Order
          </button>
        </div>
      </div>
    </>
  )
}

export default UserOrderCard