import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { serverUrl } from '../App'
import { useNavigate, useParams } from 'react-router-dom'
import { FaStore } from "react-icons/fa6";
import { FaLocationDot } from "react-icons/fa6";
import { FaUtensils } from "react-icons/fa";
import FoodCard from '../components/FoodCard';
import { FaArrowLeft } from "react-icons/fa";
import { FiClock, FiStar } from 'react-icons/fi';

const css = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

.shop-page {
  font-family: 'Inter', sans-serif;
  min-height: 100vh;
  background: #f8f8f9;
  padding-bottom: 80px;
}

/* ── Back button ── */
.shop-back {
  position: fixed; top: 16px; left: 16px; z-index: 100;
  display: flex; align-items: center; gap: 7px;
  background: rgba(0,0,0,0.5); color: #fff;
  border: 1px solid rgba(255,255,255,0.15);
  padding: 8px 14px; border-radius: 50px;
  font-size: 0.78rem; font-weight: 700; cursor: pointer;
  backdrop-filter: blur(12px); transition: all .15s;
  font-family: 'Inter', sans-serif;
}
.shop-back:hover { background: rgba(0,0,0,0.7); transform: translateX(-2px); }

/* ── Hero ── */
.shop-hero {
  position: relative; width: 100%;
  height: 280px;
}
@media(min-width:640px){ .shop-hero { height: 340px; } }
@media(min-width:1024px){ .shop-hero { height: 400px; } }

.shop-hero-img {
  width: 100%; height: 100%; object-fit: cover;
  display: block;
}

.shop-hero-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(
    180deg,
    rgba(0,0,0,0.15) 0%,
    rgba(0,0,0,0.3) 40%,
    rgba(0,0,0,0.75) 100%
  );
}

.shop-hero-content {
  position: absolute; bottom: 0; left: 0; right: 0;
  padding: 28px 24px;
  display: flex; flex-direction: column; gap: 10px;
}
@media(min-width:640px){ .shop-hero-content { padding: 36px 40px; } }

.shop-hero-badge {
  display: inline-flex; align-items: center; gap: 6px;
  background: rgba(255,255,255,0.15);
  border: 1px solid rgba(255,255,255,0.2);
  color: rgba(255,255,255,0.9);
  padding: 5px 12px; border-radius: 50px;
  font-size: 0.7rem; font-weight: 700;
  width: fit-content; backdrop-filter: blur(8px);
}

.shop-hero-name {
  font-size: 2rem; font-weight: 900; color: #fff;
  letter-spacing: -0.6px; margin: 0; line-height: 1.1;
  text-shadow: 0 2px 12px rgba(0,0,0,0.3);
}
@media(min-width:640px){ .shop-hero-name { font-size: 2.6rem; } }

.shop-hero-addr {
  display: flex; align-items: center; gap: 7px;
  font-size: 0.82rem; color: rgba(255,255,255,0.75);
  font-weight: 500;
}

/* ── Info strip ── */
.shop-info-strip {
  background: #fff;
  border-bottom: 1px solid rgba(0,0,0,0.06);
  box-shadow: 0 2px 12px rgba(0,0,0,0.04);
}
.shop-info-inner {
  max-width: 1100px; margin: 0 auto;
  padding: 0 24px;
  display: flex; align-items: center; gap: 0;
}
.shop-info-item {
  flex: 1; padding: 16px 12px; text-align: center;
  border-right: 1px solid #f5f5f5;
  display: flex; flex-direction: column; align-items: center; gap: 3px;
}
.shop-info-item:last-child { border-right: none; }
.shop-info-val {
  font-size: 0.95rem; font-weight: 800; color: #111; margin: 0;
}
.shop-info-lbl {
  font-size: 0.66rem; font-weight: 600; color: #aaa;
  text-transform: uppercase; letter-spacing: 0.4px; margin: 0;
}

/* ── Skeleton hero ── */
.shop-hero-skeleton {
  width: 100%; height: 280px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}
@media(min-width:640px){ .shop-hero-skeleton { height: 340px; } }
@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* ── Menu section ── */
.shop-menu {
  max-width: 1100px; margin: 36px auto 0; padding: 0 20px;
}
.shop-menu-head {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 22px;
}
.shop-menu-title {
  font-size: 1.1rem; font-weight: 800; color: #111;
  letter-spacing: -0.3px; margin: 0;
  display: flex; align-items: center; gap: 8px;
}
.shop-menu-title::before {
  content: ''; width: 3px; height: 16px; border-radius: 4px;
  background: linear-gradient(180deg, #1a3c2e, #2d6a4f); display: block;
}
.shop-menu-count {
  background: rgba(26,60,46,0.08); color: #1a3c2e;
  padding: 4px 12px; border-radius: 50px;
  font-size: 0.72rem; font-weight: 700;
}

/* ── Food grid ── */
.shop-food-grid {
  display: flex; flex-wrap: wrap; gap: 14px; justify-content: center;
}

/* ── Skeleton food cards ── */
.shop-food-skeletons {
  display: flex; flex-wrap: wrap; gap: 14px; justify-content: center;
}
.shop-food-skeleton {
  width: 215px; height: 280px; border-radius: 18px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}

/* ── Empty state ── */
.shop-empty {
  display: flex; flex-direction: column; align-items: center;
  gap: 14px; padding: 60px 20px; text-align: center;
}
.shop-empty-icon {
  width: 72px; height: 72px; border-radius: 20px;
  background: #f5f5f5; border: 1px solid #ececec;
  display: flex; align-items: center; justify-content: center;
  color: #ccc;
}
.shop-empty-title { font-size: 1rem; font-weight: 800; color: #111; margin: 0; }
.shop-empty-sub { font-size: 0.82rem; color: #aaa; margin: 0; }
`;

function Shop() {
  const { shopId } = useParams()
  const [items, setItems] = useState([])
  const [shop, setShop] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const handleShop = async () => {
    setLoading(true)
    try {
      const result = await axios.get(`${serverUrl}/api/item/get-by-shop/${shopId}`, { withCredentials: true })
      setShop(result.data.shop)
      setItems(result.data.items)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { handleShop() }, [shopId])

  return (
    <>
      <style>{css}</style>
      <div className="shop-page">

        {/* Back button */}
        <button className="shop-back" onClick={() => navigate("/")}>
          <FaArrowLeft size={12} /> Back
        </button>

        {/* Hero */}
        {loading ? (
          <div className="shop-hero-skeleton" />
        ) : shop && (
          <div className="shop-hero">
            <img src={shop.image} alt={shop.name} className="shop-hero-img" />
            <div className="shop-hero-overlay" />
            <div className="shop-hero-content">
              <span className="shop-hero-badge">
                <FaStore size={11} /> Restaurant
              </span>
              <h1 className="shop-hero-name">{shop.name}</h1>
              <div className="shop-hero-addr">
                <FaLocationDot size={13} color="#ff6b6b" />
                {shop.address}
              </div>
            </div>
          </div>
        )}

        {/* Info strip */}
        {!loading && shop && (
          <div className="shop-info-strip">
            <div className="shop-info-inner">
              <div className="shop-info-item">
                <p className="shop-info-val">4.2 ★</p>
                <p className="shop-info-lbl">Rating</p>
              </div>
              <div className="shop-info-item">
                <p className="shop-info-val">30 min</p>
                <p className="shop-info-lbl">Delivery</p>
              </div>
              <div className="shop-info-item">
                <p className="shop-info-val">{items.length}+</p>
                <p className="shop-info-lbl">Menu Items</p>
              </div>
              <div className="shop-info-item">
                <p className="shop-info-val">{shop.city}</p>
                <p className="shop-info-lbl">City</p>
              </div>
            </div>
          </div>
        )}

        {/* Menu */}
        <div className="shop-menu">
          <div className="shop-menu-head">
            <h2 className="shop-menu-title">
              <FaUtensils size={15} style={{ color: '#1a3c2e' }} /> Our Menu
            </h2>
            {!loading && items.length > 0 && (
              <span className="shop-menu-count">{items.length} items</span>
            )}
          </div>

          {/* Skeleton */}
          {loading && (
            <div className="shop-food-skeletons">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="shop-food-skeleton" />
              ))}
            </div>
          )}

          {/* Items */}
          {!loading && items.length > 0 && (
            <div className="shop-food-grid">
              {items.map((item, i) => (
                <FoodCard data={item} key={i} />
              ))}
            </div>
          )}

          {/* Empty */}
          {!loading && items.length === 0 && (
            <div className="shop-empty">
              <div className="shop-empty-icon">
                <FaUtensils size={28} />
              </div>
              <h3 className="shop-empty-title">No items available</h3>
              <p className="shop-empty-sub">This restaurant hasn't added any menu items yet.</p>
            </div>
          )}
        </div>

      </div>
    </>
  )
}

export default Shop