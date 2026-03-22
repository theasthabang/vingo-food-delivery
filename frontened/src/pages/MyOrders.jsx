import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import UserOrderCard from '../components/UserOrderCrd';
import OwnerOrderCard from '../components/OwnerOrderCard';
import { setMyOrders, updateRealtimeOrderStatus } from '../redux/userSlice';
import { socket } from "../socket";
import { TbReceipt2 } from 'react-icons/tb';
import { HiOutlineShoppingBag } from 'react-icons/hi';

const css = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

.mo {
  font-family: 'Inter', sans-serif;
  min-height: 100vh;
  background: #f8f8f9;
  padding-bottom: 80px;
}

/* ── Topbar ── */
.mo-topbar {
  position: sticky; top: 0; z-index: 50;
  background: rgba(255,255,255,0.92);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(0,0,0,0.06);
  box-shadow: 0 1px 0 rgba(0,0,0,0.04);
  padding: 0 20px; height: 60px;
  display: flex; align-items: center; gap: 14px;
}
.mo-back {
  width: 36px; height: 36px; border-radius: 10px;
  background: #f5f5f5; border: 1px solid #e5e5e5;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; color: #555; flex-shrink: 0;
  transition: all .15s;
}
.mo-back:hover { background: #ececec; color: #111; transform: translateX(-2px); }
.mo-topbar-title { font-size: 1rem; font-weight: 800; color: #111; letter-spacing: -0.3px; }
.mo-topbar-count {
  margin-left: auto;
  background: rgba(26,60,46,0.08); color: #1a3c2e;
  padding: 4px 12px; border-radius: 50px;
  font-size: 0.72rem; font-weight: 700;
}

/* ── Role badge ── */
.mo-role-strip {
  max-width: 780px; margin: 20px auto 0; padding: 0 20px;
}
.mo-role-badge {
  display: inline-flex; align-items: center; gap: 7px;
  background: #fff; border: 1px solid rgba(0,0,0,0.07);
  border-radius: 50px; padding: 7px 16px;
  font-size: 0.75rem; font-weight: 700; color: #555;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
}
.mo-role-dot {
  width: 7px; height: 7px; border-radius: 50%;
  background: linear-gradient(135deg, #1a3c2e, #2d6a4f);
}

/* ── Content ── */
.mo-inner {
  max-width: 780px; margin: 16px auto 0;
  padding: 0 20px;
  display: flex; flex-direction: column; gap: 14px;
}

/* ── Empty state ── */
.mo-empty {
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; gap: 16px;
  padding: 80px 20px; text-align: center;
}
.mo-empty-icon {
  width: 80px; height: 80px; border-radius: 24px;
  background: #f5f5f5; border: 1px solid #ececec;
  display: flex; align-items: center; justify-content: center;
  color: #ccc;
}
.mo-empty-title {
  font-size: 1.05rem; font-weight: 800; color: #111;
  margin: 0; letter-spacing: -0.3px;
}
.mo-empty-sub { font-size: 0.82rem; color: #aaa; margin: 0; line-height: 1.5; }
.mo-empty-btn {
  background: linear-gradient(135deg, #1a3c2e, #2d6a4f);
  color: #fff; padding: 11px 26px; border-radius: 12px;
  font-size: 0.83rem; font-weight: 700; cursor: pointer;
  border: none; font-family: 'Inter', sans-serif;
  box-shadow: 0 4px 14px rgba(26,60,46,0.3);
  transition: all .15s; margin-top: 4px;
}
.mo-empty-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(26,60,46,0.4); }

/* ── Live indicator ── */
.mo-live-strip {
  display: flex; align-items: center; gap: 8px;
  background: rgba(26,60,46,0.04);
  border: 1px solid rgba(26,60,46,0.1);
  border-radius: 12px; padding: 10px 14px;
  margin-bottom: 4px;
}
.mo-live-dot {
  width: 7px; height: 7px; border-radius: 50%;
  background: #22c55e; flex-shrink: 0;
  box-shadow: 0 0 0 3px rgba(34,197,94,0.2);
  animation: liveP 1.6s infinite;
}
@keyframes liveP {
  0%,100%{ box-shadow:0 0 0 3px rgba(34,197,94,0.18); }
  50%{ box-shadow:0 0 0 6px rgba(34,197,94,0.06); }
}
.mo-live-text { font-size: 0.74rem; font-weight: 600; color: #1a3c2e; }
.mo-live-sub { font-size: 0.7rem; color: #aaa; margin-left: auto; }

/* ── Section label ── */
.mo-section-label {
  font-size: 0.72rem; font-weight: 800; color: #aaa;
  text-transform: uppercase; letter-spacing: 0.8px;
  display: flex; align-items: center; gap: 8px;
  margin-bottom: 2px;
}
.mo-section-label::after {
  content: ''; flex: 1; height: 1px; background: #efefef;
}
`;

function MyOrders() {
  const { userData, myOrders } = useSelector(state => state.user)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    socket?.on('newOrder', (data) => {
      if (data.shopOrders?.owner._id == userData._id) {
        dispatch(setMyOrders([data, ...myOrders]))
      }
    })
    socket?.on('update-status', ({ orderId, shopId, status, userId }) => {
      if (userId == userData._id) {
        dispatch(updateRealtimeOrderStatus({ orderId, shopId, status }))
      }
    })
    return () => {
      socket?.off('newOrder')
      socket?.off('update-status')
    }
  }, [socket])

  const orderCount = myOrders ? myOrders.length : 0
  const isUser = userData.role === "user"
  const isOwner = userData.role === "owner"

  return (
    <>
      <style>{css}</style>
      <div className="mo">

        {/* Topbar */}
        <div className="mo-topbar">
          <div className="mo-back" onClick={() => navigate("/")}>
            <IoIosArrowRoundBack size={20} />
          </div>
          <span className="mo-topbar-title">
            {isOwner ? "Incoming Orders" : "My Orders"}
          </span>
          {orderCount > 0 && (
            <span className="mo-topbar-count">
              {orderCount} order{orderCount > 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Role badge */}
        <div className="mo-role-strip">
          <span className="mo-role-badge">
            <span className="mo-role-dot" />
            {isOwner ? "Restaurant Owner View" : "Customer View"}
          </span>
        </div>

        {/* Empty state */}
        {(!myOrders || myOrders.length === 0) ? (
          <div className="mo-empty">
            <div className="mo-empty-icon">
              {isOwner
                ? <TbReceipt2 size={36} />
                : <HiOutlineShoppingBag size={36} />
              }
            </div>
            <h2 className="mo-empty-title">
              {isOwner ? "No orders yet" : "No orders placed yet"}
            </h2>
            <p className="mo-empty-sub">
              {isOwner
                ? "Orders from customers will appear here in real-time"
                : "Browse restaurants and place your first order!"
              }
            </p>
            {isUser && (
              <button className="mo-empty-btn" onClick={() => navigate("/")}>
                Browse Restaurants →
              </button>
            )}
          </div>
        ) : (
          <div className="mo-inner">

            {/* Live indicator for owners */}
            {isOwner && (
              <div className="mo-live-strip">
                <div className="mo-live-dot" />
                <span className="mo-live-text">Live order updates enabled</span>
                <span className="mo-live-sub">Auto-refreshes in real-time</span>
              </div>
            )}

            <div className="mo-section-label">
              {isOwner ? "All Orders" : "Order History"}
            </div>

            {/* Orders list */}
            {myOrders.map((order, index) => (
              isUser ? (
                <UserOrderCard data={order} key={index} />
              ) : isOwner ? (
                <OwnerOrderCard data={order} key={index} />
              ) : null
            ))}

          </div>
        )}

      </div>
    </>
  )
}

export default MyOrders