import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { TbReceipt2 } from 'react-icons/tb';
import { FiArrowRight } from 'react-icons/fi';

const css = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

.op-page {
  font-family: 'Inter', sans-serif;
  min-height: 100vh;
  background: #f8f8f9;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  padding: 24px 20px;
  position: relative; overflow: hidden;
}

/* ── Background decoration ── */
.op-bg-circle1 {
  position: absolute; top: -120px; right: -120px;
  width: 400px; height: 400px; border-radius: 50%;
  background: radial-gradient(circle, rgba(34,197,94,0.06) 0%, transparent 70%);
  pointer-events: none;
}
.op-bg-circle2 {
  position: absolute; bottom: -100px; left: -100px;
  width: 340px; height: 340px; border-radius: 50%;
  background: radial-gradient(circle, rgba(26,60,46,0.05) 0%, transparent 70%);
  pointer-events: none;
}
.op-bg-circle3 {
  position: absolute; top: 40%; left: -60px;
  width: 200px; height: 200px; border-radius: 50%;
  background: radial-gradient(circle, rgba(255,200,0,0.04) 0%, transparent 70%);
  pointer-events: none;
}

/* ── Card ── */
.op-card {
  width: 100%; max-width: 420px;
  background: #fff; border-radius: 28px;
  border: 1px solid rgba(0,0,0,0.06);
  box-shadow: 0 4px 12px rgba(0,0,0,0.05), 0 20px 60px rgba(0,0,0,0.08);
  padding: 44px 32px 36px;
  display: flex; flex-direction: column;
  align-items: center; text-align: center;
  gap: 0; position: relative; z-index: 1;
  animation: cardPop .5s cubic-bezier(.34,1.56,.64,1);
}
@keyframes cardPop {
  from { opacity: 0; transform: scale(.92) translateY(20px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}

/* ── Success icon ── */
.op-icon-wrap {
  width: 88px; height: 88px; border-radius: 50%;
  background: linear-gradient(135deg, #dcfce7, #bbf7d0);
  border: 3px solid rgba(34,197,94,0.2);
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 24px; position: relative;
  animation: iconBounce .6s cubic-bezier(.34,1.56,.64,1) .1s both;
}
@keyframes iconBounce {
  from { opacity: 0; transform: scale(.5); }
  to   { opacity: 1; transform: scale(1); }
}
.op-icon-ring {
  position: absolute; inset: -8px; border-radius: 50%;
  border: 2px solid rgba(34,197,94,0.15);
  animation: ringPulse 2s ease infinite;
}
@keyframes ringPulse {
  0%,100%{ transform: scale(1); opacity: .6; }
  50%{ transform: scale(1.08); opacity: .2; }
}
.op-checkmark {
  font-size: 2.4rem; line-height: 1;
  animation: checkPop .4s ease .3s both;
}
@keyframes checkPop {
  from { opacity: 0; transform: scale(.3) rotate(-10deg); }
  to   { opacity: 1; transform: scale(1) rotate(0); }
}

/* ── Text ── */
.op-title {
  font-size: 1.6rem; font-weight: 900; color: #111;
  letter-spacing: -0.6px; margin: 0 0 10px;
  animation: fadeUp .4s ease .2s both;
}
.op-sub {
  font-size: 0.85rem; color: #888; line-height: 1.65;
  margin: 0 0 28px; max-width: 300px;
  animation: fadeUp .4s ease .3s both;
}
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ── Status chips ── */
.op-chips {
  display: flex; gap: 8px; flex-wrap: wrap;
  justify-content: center; margin-bottom: 28px;
  animation: fadeUp .4s ease .35s both;
}
.op-chip {
  display: flex; align-items: center; gap: 5px;
  padding: 6px 13px; border-radius: 50px;
  font-size: 0.72rem; font-weight: 700;
  border: 1px solid;
}
.op-chip.green {
  background: #dcfce7; color: #15803d;
  border-color: #bbf7d0;
}
.op-chip.blue {
  background: #dbeafe; color: #1d4ed8;
  border-color: #bfdbfe;
}
.op-chip.orange {
  background: rgba(255,200,0,0.12); color: #b45309;
  border-color: rgba(255,200,0,0.3);
}
.op-chip-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: currentColor;
}

/* ── Divider ── */
.op-divider {
  width: 100%; height: 1px;
  background: linear-gradient(90deg, transparent, #efefef, transparent);
  margin-bottom: 24px;
}

/* ── CTA buttons ── */
.op-btns {
  display: flex; flex-direction: column; gap: 10px;
  width: 100%;
  animation: fadeUp .4s ease .4s both;
}
.op-btn-primary {
  width: 100%; padding: 13px;
  background: linear-gradient(135deg, #1a3c2e, #2d6a4f);
  color: #fff; border: none; border-radius: 13px;
  font-size: 0.88rem; font-weight: 800; cursor: pointer;
  font-family: 'Inter', sans-serif; letter-spacing: -0.1px;
  box-shadow: 0 4px 16px rgba(26,60,46,0.3);
  display: flex; align-items: center; justify-content: center; gap: 8px;
  transition: all .15s;
}
.op-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 6px 22px rgba(26,60,46,0.42); }

.op-btn-ghost {
  width: 100%; padding: 12px;
  background: transparent; color: #555;
  border: 1.5px solid #e5e5e5; border-radius: 13px;
  font-size: 0.85rem; font-weight: 600; cursor: pointer;
  font-family: 'Inter', sans-serif;
  transition: all .15s;
}
.op-btn-ghost:hover { background: #f8f8f9; border-color: #d0d0d0; color: #111; }

/* ── Order ID ── */
.op-order-note {
  margin-top: 20px; font-size: 0.7rem; color: #ccc;
  animation: fadeUp .4s ease .5s both;
}
.op-order-note span { color: #aaa; font-weight: 700; }
`;

function OrderPlaced() {
  const navigate = useNavigate()
  const [count, setCount] = useState(5)

  // Auto-redirect countdown
  useEffect(() => {
    if (count <= 0) { navigate("/my-orders"); return; }
    const t = setTimeout(() => setCount(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [count])

  return (
    <>
      <style>{css}</style>
      <div className="op-page">

        {/* BG decorations */}
        <div className="op-bg-circle1" />
        <div className="op-bg-circle2" />
        <div className="op-bg-circle3" />

        <div className="op-card">

          {/* Success icon */}
          <div className="op-icon-wrap">
            <div className="op-icon-ring" />
            <span className="op-checkmark">✓</span>
          </div>

          {/* Text */}
          <h1 className="op-title">Order Placed!</h1>
          <p className="op-sub">
            Thank you for your order! Your food is being prepared and will be delivered to your doorstep shortly.
          </p>

          {/* Status chips */}
          <div className="op-chips">
            <div className="op-chip green">
              <div className="op-chip-dot" /> Order Confirmed
            </div>
            <div className="op-chip blue">
              <div className="op-chip-dot" /> Being Prepared
            </div>
            <div className="op-chip orange">
              <div className="op-chip-dot" /> ~30 min delivery
            </div>
          </div>

          <div className="op-divider" />

          {/* Buttons */}
          <div className="op-btns">
            <button className="op-btn-primary" onClick={() => navigate("/my-orders")}>
              <TbReceipt2 size={17} />
              Track Order <FiArrowRight size={15} />
            </button>
            <button className="op-btn-ghost" onClick={() => navigate("/")}>
              Back to Home
            </button>
          </div>

          {/* Auto redirect note */}
          <p className="op-order-note">
            Redirecting to orders in <span>{count}s</span>
          </p>

        </div>
      </div>
    </>
  )
}

export default OrderPlaced