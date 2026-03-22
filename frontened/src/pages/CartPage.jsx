import React from 'react'
import { IoIosArrowRoundBack } from "react-icons/io";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CartItemCard from '../components/CartItemCard';
import { FiShoppingCart } from 'react-icons/fi';
import { HiOutlineShoppingBag } from 'react-icons/hi';

const css = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

.cp {
  font-family: 'Inter', sans-serif;
  min-height: 100vh;
  background: #f8f8f9;
  padding: 0 0 80px;
}

/* ── Top bar ── */
.cp-topbar {
  position: sticky; top: 0; z-index: 50;
  background: rgba(255,255,255,0.92);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(0,0,0,0.06);
  box-shadow: 0 1px 0 rgba(0,0,0,0.04);
  padding: 0 20px; height: 60px;
  display: flex; align-items: center; gap: 14px;
}
.cp-back {
  width: 36px; height: 36px; border-radius: 10px;
  background: #f5f5f5; border: 1px solid #e5e5e5;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; color: #555; flex-shrink: 0;
  transition: all .15s;
}
.cp-back:hover { background: #ececec; color: #111; transform: translateX(-2px); }
.cp-topbar-title {
  font-size: 1rem; font-weight: 800; color: #111;
  letter-spacing: -0.3px;
}
.cp-topbar-count {
  margin-left: auto;
  background: rgba(26,60,46,0.08); color: #1a3c2e;
  padding: 4px 12px; border-radius: 50px;
  font-size: 0.72rem; font-weight: 700;
}

/* ── Content ── */
.cp-inner {
  max-width: 740px; margin: 0 auto;
  padding: 28px 20px 0;
  display: flex; flex-direction: column; gap: 24px;
}

/* ── Empty state ── */
.cp-empty {
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; gap: 16px;
  padding: 80px 20px; text-align: center;
}
.cp-empty-icon {
  width: 80px; height: 80px; border-radius: 24px;
  background: #f5f5f5; border: 1px solid #ececec;
  display: flex; align-items: center; justify-content: center;
  color: #ccc;
}
.cp-empty-title {
  font-size: 1.1rem; font-weight: 800; color: #111;
  margin: 0; letter-spacing: -0.3px;
}
.cp-empty-sub { font-size: 0.82rem; color: #aaa; margin: 0; }
.cp-empty-btn {
  background: linear-gradient(135deg, #1a3c2e, #2d6a4f);
  color: #fff; padding: 11px 26px; border-radius: 12px;
  font-size: 0.83rem; font-weight: 700; cursor: pointer;
  border: none; font-family: 'Inter', sans-serif;
  box-shadow: 0 4px 14px rgba(26,60,46,0.3);
  transition: all .15s; margin-top: 4px;
}
.cp-empty-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(26,60,46,0.4); }

/* ── Items list ── */
.cp-items-section {}
.cp-items-head {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 14px;
}
.cp-items-title {
  font-size: 0.82rem; font-weight: 700; color: #111;
  display: flex; align-items: center; gap: 7px;
}
.cp-items-title::before {
  content: ''; width: 3px; height: 14px; border-radius: 4px;
  background: linear-gradient(180deg, #1a3c2e, #2d6a4f); display: block;
}
.cp-items-list { display: flex; flex-direction: column; gap: 10px; }

/* ── Summary card ── */
.cp-summary {
  background: #fff; border-radius: 20px;
  border: 1px solid rgba(0,0,0,0.06);
  box-shadow: 0 2px 8px rgba(0,0,0,0.04), 0 8px 28px rgba(0,0,0,0.06);
  overflow: hidden;
}
.cp-summary-header {
  padding: 16px 20px;
  border-bottom: 1px solid #f5f5f5;
  font-size: 0.82rem; font-weight: 800; color: #111;
  display: flex; align-items: center; gap: 7px;
}
.cp-summary-header::before {
  content: ''; width: 3px; height: 14px; border-radius: 4px;
  background: linear-gradient(180deg, #1a3c2e, #2d6a4f); display: block;
}
.cp-summary-body { padding: 16px 20px; display: flex; flex-direction: column; gap: 10px; }

.cp-summary-row {
  display: flex; align-items: center; justify-content: space-between;
}
.cp-summary-row-label { font-size: 0.82rem; color: #888; font-weight: 500; }
.cp-summary-row-val { font-size: 0.82rem; color: #111; font-weight: 600; }

.cp-summary-divider { height: 1px; background: #f5f5f5; margin: 2px 0; }

.cp-summary-total-row {
  display: flex; align-items: center; justify-content: space-between;
  padding-top: 10px; border-top: 1px solid #f0f0f0;
}
.cp-summary-total-label { font-size: 0.92rem; font-weight: 800; color: #111; }
.cp-summary-total-val {
  font-size: 1.1rem; font-weight: 900;
  background: linear-gradient(135deg, #1a3c2e, #2d6a4f);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  background-clip: text; letter-spacing: -0.3px;
}

/* ── Checkout button ── */
.cp-checkout-wrap { padding: 16px 20px; border-top: 1px solid #f5f5f5; }
.cp-checkout-btn {
  width: 100%; padding: 14px;
  background: linear-gradient(135deg, #1a3c2e, #2d6a4f);
  color: #fff; border: none; border-radius: 14px;
  font-size: 0.9rem; font-weight: 800; cursor: pointer;
  font-family: 'Inter', sans-serif; letter-spacing: -0.2px;
  box-shadow: 0 4px 16px rgba(26,60,46,0.3);
  display: flex; align-items: center; justify-content: center; gap: 10px;
  transition: all .15s;
}
.cp-checkout-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 24px rgba(26,60,46,0.42); }

.cp-checkout-note {
  text-align: center; font-size: 0.7rem; color: #bbb;
  margin-top: 10px; display: flex; align-items: center;
  justify-content: center; gap: 4px;
}

/* ── Delivery info strip ── */
.cp-delivery-strip {
  display: flex; align-items: center; gap: 10px;
  background: rgba(26,60,46,0.04);
  border: 1px solid rgba(26,60,46,0.1);
  border-radius: 12px; padding: 11px 14px;
}
.cp-delivery-dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: #22c55e; flex-shrink: 0;
  box-shadow: 0 0 0 3px rgba(34,197,94,0.2);
}
.cp-delivery-text { font-size: 0.76rem; font-weight: 600; color: #1a3c2e; }
.cp-delivery-sub { font-size: 0.7rem; color: #888; margin-left: auto; }
`;

function CartPage() {
  const navigate = useNavigate()
  const { cartItems, totalAmount } = useSelector(state => state.user)

  const itemCount = cartItems ? cartItems.length : 0
  const deliveryFee = 0
  const taxes = totalAmount ? Math.round(totalAmount * 0.05) : 0
  const grandTotal = totalAmount ? totalAmount + taxes : 0

  return (
    <>
      <style>{css}</style>
      <div className="cp">

        {/* Top bar */}
        <div className="cp-topbar">
          <div className="cp-back" onClick={() => navigate("/")}>
            <IoIosArrowRoundBack size={20} />
          </div>
          <span className="cp-topbar-title">Your Cart</span>
          {itemCount > 0 && (
            <span className="cp-topbar-count">{itemCount} item{itemCount > 1 ? 's' : ''}</span>
          )}
        </div>

        {/* Empty state */}
        {(!cartItems || cartItems.length === 0) ? (
          <div className="cp-empty">
            <div className="cp-empty-icon">
              <HiOutlineShoppingBag size={36} />
            </div>
            <h2 className="cp-empty-title">Your cart is empty</h2>
            <p className="cp-empty-sub">Add items from a restaurant to get started</p>
            <button className="cp-empty-btn" onClick={() => navigate("/")}>
              Browse Restaurants →
            </button>
          </div>
        ) : (
          <div className="cp-inner">

            {/* Delivery strip */}
            <div className="cp-delivery-strip">
              <div className="cp-delivery-dot" />
              <span className="cp-delivery-text">Free delivery on this order!</span>
              <span className="cp-delivery-sub">~30 min</span>
            </div>

            {/* Items */}
            <div className="cp-items-section">
              <div className="cp-items-head">
                <span className="cp-items-title">Order Items</span>
              </div>
              <div className="cp-items-list">
                {cartItems.map((item, index) => (
                  <CartItemCard data={item} key={index} />
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="cp-summary">
              <div className="cp-summary-header">Bill Details</div>
              <div className="cp-summary-body">
                <div className="cp-summary-row">
                  <span className="cp-summary-row-label">Item Total</span>
                  <span className="cp-summary-row-val">₹{totalAmount}</span>
                </div>
                <div className="cp-summary-row">
                  <span className="cp-summary-row-label">Delivery Fee</span>
                  <span className="cp-summary-row-val" style={{ color: '#16a34a' }}>FREE</span>
                </div>
                <div className="cp-summary-row">
                  <span className="cp-summary-row-label">GST & Taxes (5%)</span>
                  <span className="cp-summary-row-val">₹{taxes}</span>
                </div>
                <div className="cp-summary-divider" />
                <div className="cp-summary-total-row">
                  <span className="cp-summary-total-label">To Pay</span>
                  <span className="cp-summary-total-val">₹{grandTotal}</span>
                </div>
              </div>

              {/* Checkout */}
              <div className="cp-checkout-wrap">
                <button className="cp-checkout-btn" onClick={() => navigate("/checkout")}>
                  <FiShoppingCart size={18} />
                  Proceed to Checkout · ₹{grandTotal}
                </button>
                <p className="cp-checkout-note">
                  🔒 Secure checkout · No hidden charges
                </p>
              </div>
            </div>

          </div>
        )}
      </div>
    </>
  )
}

export default CartPage