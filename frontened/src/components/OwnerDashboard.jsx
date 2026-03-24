import React from 'react'
import Nav from './NaV'
import { useSelector } from 'react-redux'
import { FaUtensils } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { FaPen } from "react-icons/fa";
import OwnerItemCard from './ownerItemCard';

const css = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
.od {
  font-family: 'Inter', sans-serif;
  width: 100%; min-height: 100vh;
  background: #f8f8f9;
  padding-top: 64px; padding-bottom: 80px;
  display: flex; flex-direction: column; align-items: center;
}

/* Empty */
.od-empty-wrap { padding: 60px 20px; display: flex; justify-content: center; width: 100%; }
.od-empty-card {
  width: 100%; max-width: 380px; background: #fff;
  border-radius: 24px; padding: 40px 28px; text-align: center;
  border: 1px solid rgba(0,0,0,0.06);
  box-shadow: 0 2px 8px rgba(0,0,0,0.04), 0 12px 40px rgba(0,0,0,0.08);
}
.od-empty-icon {
  width: 72px; height: 72px; border-radius: 20px; margin: 0 auto 20px;
  background: linear-gradient(135deg, rgba(255,77,45,0.1), rgba(255,140,0,0.1));
  border: 1px solid rgba(255,77,45,0.12);
  display: flex; align-items: center; justify-content: center;
}
.od-empty-title { font-size: 1.15rem; font-weight: 800; color: #111; margin: 0 0 8px; letter-spacing: -0.3px; }
.od-empty-desc { font-size: 0.82rem; color: #999; line-height: 1.6; margin: 0 0 24px; }
.od-empty-cta {
  background: linear-gradient(135deg, #ff4d2d, #ff7a00); color: #fff;
  padding: 11px 28px; border-radius: 12px; font-size: 0.83rem; font-weight: 700;
  cursor: pointer; border: none; font-family: 'Inter', sans-serif;
  box-shadow: 0 4px 14px rgba(255,77,45,0.35);
  transition: all .15s; letter-spacing: -0.1px;
}
.od-empty-cta:hover { transform: translateY(-2px); box-shadow: 0 6px 22px rgba(255,77,45,0.45); }

/* Content */
.od-content { width: 100%; max-width: 740px; padding: 28px 20px 0; display: flex; flex-direction: column; gap: 20px; }

/* Welcome strip */
.od-welcome {
  display: flex; align-items: center; gap: 14px;
  background: #fff; border-radius: 16px; padding: 16px 18px;
  border: 1px solid rgba(0,0,0,0.06);
  box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 14px rgba(0,0,0,0.04);
}
.od-welcome-icon {
  width: 44px; height: 44px; border-radius: 12px; flex-shrink: 0;
  background: linear-gradient(135deg, #ff4d2d, #ff8c00);
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 3px 10px rgba(255,77,45,0.3);
}
.od-welcome-title { font-size: 0.95rem; font-weight: 800; color: #111; margin: 0 0 2px; letter-spacing: -0.2px; }
.od-welcome-sub { font-size: 0.73rem; color: #aaa; margin: 0; }

/* Shop card */
.od-shop-card {
  background: #fff; border-radius: 20px; overflow: hidden;
  border: 1px solid rgba(0,0,0,0.06);
  box-shadow: 0 2px 8px rgba(0,0,0,0.05), 0 8px 32px rgba(0,0,0,0.07);
  position: relative; transition: box-shadow .2s;
}
.od-shop-img { width: 100%; height: 190px; object-fit: cover; display: block; }
@media(min-width:600px){ .od-shop-img { height: 240px; } }
.od-shop-img-grad {
  position: absolute; top: 0; left: 0; right: 0; height: 190px;
  background: linear-gradient(180deg, transparent 55%, rgba(0,0,0,0.5) 100%);
}
@media(min-width:600px){ .od-shop-img-grad { height: 240px; } }
.od-shop-edit {
  position: absolute; top: 14px; right: 14px;
  width: 36px; height: 36px; border-radius: 10px;
  background: rgba(255,255,255,0.9); border: 1px solid rgba(255,255,255,0.5);
  backdrop-filter: blur(12px); cursor: pointer; color: #ff4d2d;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 2px 10px rgba(0,0,0,0.12);
  transition: all .15s;
}
.od-shop-edit:hover { transform: scale(1.07); box-shadow: 0 4px 16px rgba(0,0,0,0.18); }
.od-shop-body { padding: 16px 18px; }
.od-shop-name { font-size: 1.05rem; font-weight: 800; color: #111; margin: 0 0 4px; letter-spacing: -0.3px; }
.od-shop-city { font-size: 0.78rem; color: #888; margin: 0 0 2px; font-weight: 500; }
.od-shop-addr { font-size: 0.74rem; color: #bbb; margin: 0; }

/* Items section */
.od-items-section { display: flex; flex-direction: column; gap: 10px; padding-bottom: 20px; }
.od-items-header {
  display: flex; align-items: center; justify-content: space-between;
  padding-bottom: 12px; border-bottom: 1px solid #f0f0f0; margin-bottom: 2px;
}
.od-items-title { font-size: 0.88rem; font-weight: 700; color: #111; margin: 0; display: flex; align-items: center; gap: 7px; }
.od-items-title::before { content:''; width:3px; height:14px; border-radius:4px; background:linear-gradient(180deg,#ff4d2d,#ff8c00); display:block; }
.od-items-badge {
  background: linear-gradient(135deg, #ff4d2d, #ff7a00); color: #fff;
  padding: 3px 10px; border-radius: 50px; font-size: 0.68rem; font-weight: 700;
}
`;

function OwnerDashboard() {
  const { myShopData } = useSelector(s => s.owner)
  const navigate = useNavigate()

  return (
    <>
      <style>{css}</style>
      <div className="od">
        <Nav />

        {!myShopData && (
          <div className="od-empty-wrap">
            <div className="od-empty-card">
              <div className="od-empty-icon">
                <FaUtensils style={{ color: '#ff4d2d', fontSize: '1.6rem' }} />
              </div>
              <h2 className="od-empty-title">List Your Restaurant</h2>
              <p className="od-empty-desc">Join Vingo and reach thousands of hungry customers in your city every day.</p>
              <button className="od-empty-cta" onClick={() => navigate("/create-edit-shop")}>Get Started →</button>
            </div>
          </div>
        )}

        {myShopData && (
          <div className="od-content">
            <div className="od-welcome">
              <div className="od-welcome-icon">
                <FaUtensils style={{ color: '#fff', fontSize: '1.2rem' }} />
              </div>
              <div>
                <p className="od-welcome-title">{myShopData.name}</p>
                <p className="od-welcome-sub">Restaurant Dashboard</p>
              </div>
            </div>

            <div className="od-shop-card">
              <img src={myShopData.image} alt={myShopData.name} className="od-shop-img" />
              <div className="od-shop-img-grad" />
              <button className="od-shop-edit" onClick={() => navigate("/create-edit-shop")}><FaPen size={14} /></button>
              <div className="od-shop-body">
                <p className="od-shop-name">{myShopData.name}</p>
                <p className="od-shop-city">{myShopData.city}, {myShopData.state}</p>
                <p className="od-shop-addr">{myShopData.address}</p>
              </div>
            </div>

            {myShopData?.items?.length === 0 && (
              <div className="od-empty-wrap" style={{ padding: '0' }}>
                <div className="od-empty-card" style={{ maxWidth: '100%' }}>
                  <div className="od-empty-icon">
                    <FaUtensils style={{ color: '#ff4d2d', fontSize: '1.6rem' }} />
                  </div>
                  <h2 className="od-empty-title">Add Your First Dish</h2>
                  <p className="od-empty-desc">Start building your menu by adding items for customers to order.</p>
                  <button className="od-empty-cta" onClick={() => navigate("/add-item")}>Add Item →</button>
                </div>
              </div>
            )}

            {myShopData?.items?.length > 0 && (
              <div className="od-items-section">
                <div className="od-items-header">
                  <span className="od-items-title">Menu</span>
                  <span className="od-items-badge">{myShopData.items.length} items</span>
                </div>
                {myShopData.items.map((item, i) => <OwnerItemCard data={item} key={i} />)}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}

export default OwnerDashboard