import React, { useEffect, useRef, useState } from 'react'
import Nav from './NaV.JSX'
import { categories } from '../categories'
import CategoryCard from './CategoryCard'
import { FaCircleChevronLeft, FaCircleChevronRight } from "react-icons/fa6";
import { useSelector } from 'react-redux';
import FoodCard from './FoodCard';
import { useNavigate } from 'react-router-dom';

const css = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

/* ─────────────────────────────────────────
   BASE
───────────────────────────────────────── */
.ud {
  font-family: 'Inter', sans-serif;
  width: 100vw; min-height: 100vh;
  background: #f9f9f9;
  padding-top: 64px;
  overflow-x: hidden;
}

/* ─────────────────────────────────────────
   HERO
───────────────────────────────────────── */
.ud-hero {
  width: 100%;
  background: #1a3c2e;
  position: relative;
  overflow: hidden;
  min-height: 340px;
  display: flex; align-items: center;
}

/* background texture blobs */
.ud-hero-blob1 {
  position:absolute; right:-80px; top:-80px;
  width:360px; height:360px; border-radius:50%;
  background:radial-gradient(circle, rgba(255,200,0,0.12) 0%, transparent 70%);
  pointer-events:none;
}
.ud-hero-blob2 {
  position:absolute; left:-60px; bottom:-60px;
  width:300px; height:300px; border-radius:50%;
  background:radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%);
  pointer-events:none;
}
.ud-hero-blob3 {
  position:absolute; right:25%; top:0; bottom:0;
  width:1px; background:rgba(255,255,255,0.05);
  pointer-events:none;
}

.ud-hero-inner {
  position:relative; z-index:2;
  width:100%; max-width:1100px; margin:0 auto;
  padding:48px 24px;
  display:flex; flex-direction:column; gap:16px;
}
@media(min-width:768px){
  .ud-hero-inner { padding:60px 40px; }
}

.ud-hero-badge {
  display:inline-flex; align-items:center; gap:6px;
  background:rgba(255,255,255,0.1);
  border:1px solid rgba(255,255,255,0.15);
  color:rgba(255,255,255,0.8);
  padding:6px 14px; border-radius:50px;
  font-size:0.73rem; font-weight:600;
  width:fit-content;
  backdrop-filter:blur(8px);
}
.ud-hero-badge-dot {
  width:6px; height:6px; border-radius:50%;
  background:#4ade80;
  box-shadow:0 0 6px rgba(74,222,128,0.8);
}

.ud-hero-title {
  font-size:2rem; font-weight:900; color:#fff;
  line-height:1.1; margin:0; letter-spacing:-1px;
  max-width:500px;
}
@media(min-width:640px){ .ud-hero-title{ font-size:2.6rem; } }
@media(min-width:1024px){ .ud-hero-title{ font-size:3rem; } }

.ud-hero-title-accent {
  color:#ffc800;
  display:block;
}

.ud-hero-sub {
  font-size:0.88rem; color:rgba(255,255,255,0.55);
  line-height:1.65; margin:0; max-width:420px;
}

.ud-hero-actions {
  display:flex; align-items:center; gap:12px;
  flex-wrap:wrap; margin-top:4px;
}

.ud-hero-cta {
  background:#ffc800; color:#1a1a1a;
  padding:13px 28px; border-radius:50px;
  font-size:0.85rem; font-weight:800; cursor:default;
  border:none; letter-spacing:-0.1px;
  box-shadow:0 4px 20px rgba(255,200,0,0.4);
  display:inline-flex; align-items:center; gap:8px;
}

.ud-hero-social {
  display:flex; align-items:center; gap:6px;
}
.ud-hero-avatars {
  display:flex;
}
.ud-hero-av {
  width:28px; height:28px; border-radius:50%;
  background:linear-gradient(135deg,#ff4d2d,#ff8c00);
  border:2px solid #1a3c2e;
  margin-left:-8px; display:flex; align-items:center;
  justify-content:center; font-size:0.55rem; color:#fff; font-weight:700;
}
.ud-hero-av:first-child { margin-left:0; }
.ud-hero-social-text {
  font-size:0.72rem; color:rgba(255,255,255,0.6); font-weight:500;
}
.ud-hero-social-text strong { color:#ffc800; font-weight:800; }

/* ─────────────────────────────────────────
   STATS STRIP
───────────────────────────────────────── */
.ud-stats-strip {
  background:#fff;
  border-bottom:1px solid rgba(0,0,0,0.06);
  box-shadow:0 2px 12px rgba(0,0,0,0.04);
}
.ud-stats-inner {
  max-width:1100px; margin:0 auto;
  padding:0 24px;
  display:grid; grid-template-columns:repeat(3,1fr);
}
.ud-stat-item {
  padding:18px 16px; text-align:center;
  border-right:1px solid rgba(0,0,0,0.06);
  transition:background .15s;
}
.ud-stat-item:last-child { border-right:none; }
.ud-stat-item:hover { background:#fafafa; }
.ud-stat-num {
  font-size:1.25rem; font-weight:900; margin:0 0 2px;
  background:linear-gradient(135deg,#1a3c2e,#2d6a4f);
  -webkit-background-clip:text; -webkit-text-fill-color:transparent;
  background-clip:text; letter-spacing:-0.5px;
}
.ud-stat-lbl { font-size:0.68rem; font-weight:600; color:#aaa; margin:0; text-transform:uppercase; letter-spacing:0.5px; }

/* ─────────────────────────────────────────
   LAYOUT
───────────────────────────────────────── */
.ud-container {
  max-width:1100px; margin:0 auto; padding:0 20px;
}

/* ─────────────────────────────────────────
   SECTION HEADER
───────────────────────────────────────── */
.ud-sec {
  padding:40px 0 0;
}
.ud-sec-head {
  display:flex; align-items:flex-end; justify-content:space-between;
  margin-bottom:20px; gap:12px;
}
.ud-sec-title {
  font-size:1.25rem; font-weight:900; color:#111;
  letter-spacing:-0.4px; margin:0; line-height:1.2;
}
@media(min-width:640px){ .ud-sec-title{ font-size:1.5rem; } }
.ud-sec-title-accent { color:#1a3c2e; }
.ud-sec-link {
  display:inline-flex; align-items:center; gap:4px;
  font-size:0.75rem; font-weight:700; color:#1a3c2e;
  cursor:default; white-space:nowrap; padding:7px 14px;
  border-radius:50px; border:1.5px solid #1a3c2e;
  transition:all .15s;
}
.ud-sec-link:hover { background:#1a3c2e; color:#fff; }

/* ─────────────────────────────────────────
   CATEGORY CHIPS (new style)
───────────────────────────────────────── */
.ud-cat-scroll { position:relative; }
.ud-cat-row {
  display:flex; gap:10px; overflow-x:auto;
  padding-bottom:4px; scrollbar-width:none;
}
.ud-cat-row::-webkit-scrollbar { display:none; }

/* ─────────────────────────────────────────
   CATEGORY CHIP CARD
───────────────────────────────────────── */
.ud-cat-chip {
  flex-shrink:0;
  background:#fff; border-radius:16px;
  border:1.5px solid rgba(0,0,0,0.07);
  box-shadow:0 1px 4px rgba(0,0,0,0.04), 0 4px 14px rgba(0,0,0,0.04);
  padding:14px 16px; min-width:110px;
  display:flex; flex-direction:column; align-items:center;
  gap:8px; cursor:pointer;
  transition:all .2s cubic-bezier(.34,1.56,.64,1);
}
@media(min-width:768px){ .ud-cat-chip{ min-width:130px; padding:16px 18px; } }
.ud-cat-chip:hover {
  transform:translateY(-4px);
  box-shadow:0 4px 8px rgba(26,60,46,0.08), 0 12px 32px rgba(26,60,46,0.14);
  border-color:rgba(26,60,46,0.2);
}
.ud-cat-chip.active {
  background:#1a3c2e; border-color:#1a3c2e;
}
.ud-cat-chip-img {
  width:52px; height:52px; border-radius:12px;
  object-fit:cover; background:#f5f5f5;
}
@media(min-width:768px){ .ud-cat-chip-img{ width:60px; height:60px; } }
.ud-cat-chip-name {
  font-size:0.72rem; font-weight:700; color:#333;
  text-align:center; line-height:1.2;
}
.ud-cat-chip.active .ud-cat-chip-name { color:#fff; }

/* ─────────────────────────────────────────
   SCROLL ARROWS
───────────────────────────────────────── */
.ud-arrow {
  position:absolute; top:50%; transform:translateY(-50%);
  width:32px; height:32px; border-radius:50%;
  background:#fff; border:1px solid #e8e8e8;
  box-shadow:0 2px 10px rgba(0,0,0,0.1);
  display:flex; align-items:center; justify-content:center;
  cursor:pointer; color:#1a3c2e; z-index:5;
  transition:all .15s;
}
.ud-arrow:hover { box-shadow:0 4px 18px rgba(26,60,46,0.18); transform:translateY(-50%) scale(1.08); }
.ud-arrow.left { left:-8px; }
.ud-arrow.right { right:-8px; }

/* ─────────────────────────────────────────
   RESTAURANT STRIP
───────────────────────────────────────── */
.ud-shop-row {
  display:flex; gap:12px; overflow-x:auto;
  padding-bottom:6px; scrollbar-width:none;
}
.ud-shop-row::-webkit-scrollbar { display:none; }

/* ─────────────────────────────────────────
   FEATURED FOOD SECTION
───────────────────────────────────────── */
.ud-food-sec {
  padding:40px 0 60px;
  background:transparent;
}
.ud-food-grid {
  display:flex; flex-wrap:wrap; gap:14px; justify-content:center;
}

/* ─────────────────────────────────────────
   SEARCH RESULTS
───────────────────────────────────────── */
.ud-search-wrap {
  padding:28px 0 0;
}
.ud-search-card {
  background:#fff; border-radius:20px; padding:20px;
  border:1px solid rgba(0,0,0,0.06);
  box-shadow:0 2px 8px rgba(0,0,0,0.04), 0 8px 28px rgba(0,0,0,0.05);
}
.ud-search-head {
  display:flex; align-items:center; gap:8px;
  font-size:0.88rem; font-weight:800; color:#111;
  margin-bottom:16px; padding-bottom:12px;
  border-bottom:1px solid #f5f5f5;
}
.ud-search-head::before {
  content:''; width:3px; height:15px; border-radius:4px;
  background:linear-gradient(#1a3c2e,#2d6a4f); display:block;
}

/* ─────────────────────────────────────────
   DIVIDER
───────────────────────────────────────── */
.ud-divider {
  height:1px; margin:0;
  background:linear-gradient(90deg,transparent,rgba(0,0,0,0.06),transparent);
}

/* ─────────────────────────────────────────
   BOTTOM CTA BANNER
───────────────────────────────────────── */
.ud-bottom-banner {
  background:linear-gradient(135deg,#1a3c2e 0%,#2d6a4f 100%);
  padding:40px 24px;
  position:relative; overflow:hidden;
}
.ud-bb-blob1 {
  position:absolute; right:-60px; top:-60px;
  width:240px; height:240px; border-radius:50%;
  background:rgba(255,200,0,0.08);
}
.ud-bb-blob2 {
  position:absolute; left:30%; bottom:-80px;
  width:200px; height:200px; border-radius:50%;
  background:rgba(255,255,255,0.04);
}
.ud-bb-inner {
  max-width:1100px; margin:0 auto; position:relative; z-index:1;
  display:flex; flex-direction:column; gap:10px;
}
@media(min-width:640px){
  .ud-bb-inner { flex-direction:row; align-items:center; justify-content:space-between; }
}
.ud-bb-title { font-size:1.3rem; font-weight:900; color:#fff; letter-spacing:-0.4px; margin:0; }
.ud-bb-title span { color:#ffc800; }
.ud-bb-sub { font-size:0.8rem; color:rgba(255,255,255,0.6); margin:4px 0 0; }
.ud-bb-cta {
  background:#ffc800; color:#1a1a1a;
  padding:12px 26px; border-radius:50px;
  font-size:0.82rem; font-weight:800; cursor:default;
  border:none; white-space:nowrap; flex-shrink:0;
  box-shadow:0 4px 18px rgba(255,200,0,0.4);
}
`;

/* ─── tiny category chip component ─── */
function CatChip({ name, image, onClick, active }) {
  return (
    <div className={"ud-cat-chip" + (active ? " active" : "")} onClick={onClick}>
      <img src={image} alt={name} className="ud-cat-chip-img" />
      <span className="ud-cat-chip-name">{name}</span>
    </div>
  )
}

function UserDashboard() {
  const { currentCity, shopInMyCity, itemsInMyCity, searchItems } = useSelector(s => s.user)
  const cateScrollRef = useRef()
  const shopScrollRef = useRef()
  const navigate = useNavigate()

  const [showLeftCate, setShowLeftCate] = useState(false)
  const [showRightCate, setShowRightCate] = useState(false)
  const [showLeftShop, setShowLeftShop] = useState(false)
  const [showRightShop, setShowRightShop] = useState(false)
  const [updatedItemsList, setUpdatedItemsList] = useState([])
  const [activeCategory, setActiveCategory] = useState("All")

  const handleFilterByCategory = (category) => {
    setActiveCategory(category)
    if (category === "All") setUpdatedItemsList(itemsInMyCity)
    else setUpdatedItemsList(itemsInMyCity?.filter(i => i.category === category))
  }

  useEffect(() => { setUpdatedItemsList(itemsInMyCity) }, [itemsInMyCity])

  const updateBtn = (ref, setL, setR) => {
    const el = ref.current
    if (el) { setL(el.scrollLeft > 0); setR(el.scrollLeft + el.clientWidth < el.scrollWidth) }
  }
  const scrollTo = (ref, dir) => {
    if (ref.current) ref.current.scrollBy({ left: dir === "left" ? -220 : 220, behavior: "smooth" })
  }

  useEffect(() => {
    if (cateScrollRef.current) {
      updateBtn(cateScrollRef, setShowLeftCate, setShowRightCate)
      updateBtn(shopScrollRef, setShowLeftShop, setShowRightShop)
      cateScrollRef.current.addEventListener('scroll', () => updateBtn(cateScrollRef, setShowLeftCate, setShowRightCate))
      shopScrollRef.current.addEventListener('scroll', () => updateBtn(shopScrollRef, setShowLeftShop, setShowRightShop))
    }
    return () => {
      cateScrollRef?.current?.removeEventListener("scroll", () => updateBtn(cateScrollRef, setShowLeftCate, setShowRightCate))
      shopScrollRef?.current?.removeEventListener("scroll", () => updateBtn(shopScrollRef, setShowLeftShop, setShowRightShop))
    }
  }, [categories])

  const shopCount = shopInMyCity ? shopInMyCity.length : 0
  const itemCount = itemsInMyCity ? itemsInMyCity.length : 0

  return (
    <>
      <style>{css}</style>
      <div className="ud">
        <Nav />

        {/* ── HERO ── */}
        <section className="ud-hero">
          <div className="ud-hero-blob1" />
          <div className="ud-hero-blob2" />
          <div className="ud-hero-blob3" />
          <div className="ud-hero-inner">
            <div className="ud-hero-badge">
              <div className="ud-hero-badge-dot" />
              Now delivering in {currentCity}
            </div>
            <h1 className="ud-hero-title">
              Satisfy Your<br />
              <span className="ud-hero-title-accent">Hunger the Delicious Way</span>
            </h1>
            <p className="ud-hero-sub">
              Delicious meals made with fresh ingredients, delivered straight to your door. Fast, hot, and always on time.
            </p>
            <div className="ud-hero-actions">
              <div className="ud-hero-cta">
                🍔 Order Now
              </div>
              <div className="ud-hero-social">
                <div className="ud-hero-avatars">
                  <div className="ud-hero-av">A</div>
                  <div className="ud-hero-av">B</div>
                  <div className="ud-hero-av">C</div>
                </div>
                <span className="ud-hero-social-text"><strong>46.8K+</strong> Happy Customers</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── STATS STRIP ── */}
        <div className="ud-stats-strip">
          <div className="ud-stats-inner">
            <div className="ud-stat-item">
              <p className="ud-stat-num">{shopCount}+</p>
              <p className="ud-stat-lbl">Restaurants</p>
            </div>
            <div className="ud-stat-item">
              <p className="ud-stat-num">{itemCount}+</p>
              <p className="ud-stat-lbl">Dishes</p>
            </div>
            <div className="ud-stat-item">
              <p className="ud-stat-num">30</p>
              <p className="ud-stat-lbl">Min Delivery</p>
            </div>
          </div>
        </div>

        {/* ── SEARCH RESULTS ── */}
        {searchItems && searchItems.length > 0 && (
          <div className="ud-container">
            <div className="ud-search-wrap">
              <div className="ud-search-card">
                <div className="ud-search-head">Search Results</div>
                <div className="ud-food-grid">
                  {searchItems.map(item => <FoodCard data={item} key={item._id} />)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── CATEGORIES ── */}
        <div className="ud-container">
          <div className="ud-sec">
            <div className="ud-sec-head">
              <h2 className="ud-sec-title">
                Explore Our <span className="ud-sec-title-accent">Categories</span>
              </h2>
              <span className="ud-sec-link">View All →</span>
            </div>
            <div className="ud-cat-scroll">
              {showLeftCate && (
                <button className="ud-arrow left" onClick={() => scrollTo(cateScrollRef, "left")}>
                  <FaCircleChevronLeft size={14} />
                </button>
              )}
              <div className="ud-cat-row" ref={cateScrollRef}>
                {categories.map((c, i) => (
                  <CatChip
                    key={i}
                    name={c.category}
                    image={c.image}
                    active={activeCategory === c.category}
                    onClick={() => handleFilterByCategory(c.category)}
                  />
                ))}
              </div>
              {showRightCate && (
                <button className="ud-arrow right" onClick={() => scrollTo(cateScrollRef, "right")}>
                  <FaCircleChevronRight size={14} />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="ud-divider" style={{ margin: '32px 0 0' }} />

        {/* ── TOP RESTAURANTS ── */}
        <div className="ud-container">
          <div className="ud-sec">
            <div className="ud-sec-head">
              <h2 className="ud-sec-title">
                Best Restaurants in <span className="ud-sec-title-accent">{currentCity}</span>
              </h2>
            </div>
            <div style={{ position: 'relative' }}>
              {showLeftShop && (
                <button className="ud-arrow left" onClick={() => scrollTo(shopScrollRef, "left")}>
                  <FaCircleChevronLeft size={14} />
                </button>
              )}
              <div className="ud-shop-row" ref={shopScrollRef}>
                {shopInMyCity?.map((shop, i) => (
                  <CategoryCard
                    name={shop.name} image={shop.image} key={i}
                    onClick={() => navigate("/shop/" + shop._id)}
                  />
                ))}
              </div>
              {showRightShop && (
                <button className="ud-arrow right" onClick={() => scrollTo(shopScrollRef, "right")}>
                  <FaCircleChevronRight size={14} />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="ud-divider" style={{ margin: '32px 0 0' }} />

        {/* ── FEATURED FOOD ITEMS ── */}
        <div className="ud-container">
          <div className="ud-food-sec">
            <div className="ud-sec-head">
              <h2 className="ud-sec-title">
                Featured <span className="ud-sec-title-accent">Food Items</span>
              </h2>
            </div>
            <div className="ud-food-grid">
              {updatedItemsList?.map((item, i) => <FoodCard key={i} data={item} />)}
            </div>
          </div>
        </div>

        {/* ── BOTTOM CTA BANNER ── */}
        <div className="ud-bottom-banner">
          <div className="ud-bb-blob1" /><div className="ud-bb-blob2" />
          <div className="ud-bb-inner">
            <div>
              <h2 className="ud-bb-title">Discover <span>Delicious</span><br />Food Near You</h2>
              <p className="ud-bb-sub">Our mission is to connect food lovers with amazing restaurants.</p>
            </div>
            <div className="ud-bb-cta">Order Now →</div>
          </div>
        </div>

      </div>
    </>
  )
}

export default UserDashboard