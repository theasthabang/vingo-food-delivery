import React, { useEffect, useState, useRef, useCallback } from "react";
import { FaLocationDot } from "react-icons/fa6";
import { IoIosSearch } from "react-icons/io";
import { FiShoppingCart } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { RxCross2 } from "react-icons/rx";
import axios from "axios";
import { serverUrl } from "../App";
import { setSearchItems, setUserData } from "../redux/userSlice";
import { FaPlus } from "react-icons/fa6";
import { TbReceipt2 } from "react-icons/tb";
import { useNavigate } from "react-router-dom";

const css = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

.nav {
  font-family: 'Inter', sans-serif;
  position: fixed; top: 0; left: 0; right: 0; z-index: 9999;
  height: 64px;
  background: rgba(255,255,255,0.96);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(0,0,0,0.07);
  box-shadow: 0 1px 0 rgba(0,0,0,0.04), 0 4px 20px rgba(0,0,0,0.04);
  display: flex; align-items: center;
  justify-content: space-between;
  padding: 0 20px; gap: 12px;
}
@media(min-width:768px){ .nav { justify-content: center; gap: 20px; padding: 0 32px; } }

/* ── Logo ── */
.nav-logo {
  display: flex; align-items: center; gap: 8px;
  cursor: pointer; user-select: none; flex-shrink: 0;
}
.nav-logo-icon {
  width: 34px; height: 34px; border-radius: 10px;
  background: linear-gradient(135deg, #1a3c2e 0%, #2d6a4f 100%);
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 2px 8px rgba(26,60,46,0.3);
  font-size: 0.85rem; color: #ffc800; font-weight: 900;
  letter-spacing: -0.5px; flex-shrink: 0;
}
.nav-logo-text {
  font-size: 1.2rem; font-weight: 900; letter-spacing: -0.5px; color: #1a1a1a;
}
.nav-logo-text span { color: #1a3c2e; }

/* ── Search ── */
.nav-search {
  display: none; align-items: center; flex: 1;
  max-width: 440px; height: 40px;
  background: #f5f5f5; border-radius: 12px;
  border: 1.5px solid transparent; overflow: hidden;
  transition: all .2s;
}
.nav-search:focus-within {
  border-color: rgba(26,60,46,0.35);
  box-shadow: 0 0 0 3px rgba(26,60,46,0.08);
  background: #fff;
}
@media(min-width:768px){ .nav-search { display: flex; } }

.nav-search-city {
  display: flex; align-items: center; gap: 5px;
  padding: 0 12px; border-right: 1px solid #e5e5e5;
  height: 100%; flex-shrink: 0; max-width: 128px; overflow: hidden;
}
.nav-search-city-text { font-size: 0.74rem; font-weight: 600; color: #666; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.nav-search-field { display: flex; align-items: center; gap: 8px; padding: 0 12px; flex: 1; }
.nav-search-field input {
  border: none; background: transparent; outline: none;
  font-size: 0.82rem; color: #111; width: 100%; font-family: 'Inter', sans-serif;
}
.nav-search-field input::placeholder { color: #bbb; }

/* ── Mobile search ── */
.nav-mobile-search {
  position: fixed; top: 68px; left: 10px; right: 10px;
  background: #fff; border-radius: 14px;
  border: 1.5px solid rgba(26,60,46,0.15);
  box-shadow: 0 8px 30px rgba(0,0,0,0.1);
  display: flex; align-items: center; height: 50px;
  overflow: hidden; z-index: 9998;
  animation: navDrop .18s ease;
}
@media(min-width:768px){ .nav-mobile-search { display: none !important; } }
@keyframes navDrop {
  from { opacity:0; transform:translateY(-8px); }
  to { opacity:1; transform:translateY(0); }
}

/* ── Actions ── */
.nav-actions { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }

.nav-btn-ghost {
  display: flex; align-items: center; gap: 5px;
  padding: 7px 13px; border-radius: 10px;
  background: transparent; color: #444;
  font-size: 0.78rem; font-weight: 600;
  border: 1px solid #e5e5e5; cursor: pointer;
  transition: all .15s; font-family: 'Inter', sans-serif;
  white-space: nowrap;
}
.nav-btn-ghost:hover { background: #f5f5f5; border-color: #ccc; color: #111; }

.nav-btn-green {
  display: flex; align-items: center; gap: 5px;
  padding: 7px 15px; border-radius: 10px;
  background: linear-gradient(135deg,#1a3c2e,#2d6a4f);
  color: #fff; font-size: 0.78rem; font-weight: 700;
  border: none; cursor: pointer;
  box-shadow: 0 2px 8px rgba(26,60,46,0.3);
  transition: all .15s; font-family: 'Inter', sans-serif;
  white-space: nowrap;
}
.nav-btn-green:hover { transform: translateY(-1px); box-shadow: 0 4px 14px rgba(26,60,46,0.4); }

.nav-icon-btn {
  width: 36px; height: 36px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  background: transparent; border: 1px solid #e5e5e5; cursor: pointer;
  color: #555; transition: all .15s;
}
.nav-icon-btn:hover { background: #f5f5f5; color: #111; }
.nav-icon-btn.green { background: rgba(26,60,46,0.07); border-color: rgba(26,60,46,0.18); color: #1a3c2e; }
.nav-icon-btn.green:hover { background: rgba(26,60,46,0.12); }

/* ── Cart ── */
.nav-cart {
  position: relative; width: 36px; height: 36px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  background: rgba(26,60,46,0.07); border: 1px solid rgba(26,60,46,0.18);
  cursor: pointer; color: #1a3c2e; transition: all .15s;
}
.nav-cart:hover { background: rgba(26,60,46,0.13); transform: translateY(-1px); }
.nav-cart-badge {
  position: absolute; top: -5px; right: -5px;
  background: linear-gradient(135deg,#ff4d2d,#ff7a00);
  color: #fff; font-size: 0.55rem; font-weight: 800;
  min-width: 16px; height: 16px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  border: 2px solid #fff;
}

/* ── Avatar ── */
.nav-avatar-wrap { position: relative; }
.nav-avatar-btn {
  width: 36px; height: 36px; border-radius: 10px;
  background: linear-gradient(135deg, #1a3c2e, #2d6a4f);
  color: #ffc800; font-size: 0.85rem; font-weight: 800;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; border: none;
  box-shadow: 0 2px 8px rgba(26,60,46,0.3);
  transition: all .15s; font-family: 'Inter', sans-serif;
}
.nav-avatar-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 14px rgba(26,60,46,0.4); }

/* ── Dropdown ── */
.nav-dropdown {
  position: absolute; top: calc(100% + 8px); right: 0;
  width: 200px; background: #fff; border-radius: 14px; padding: 6px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.04), 0 12px 40px rgba(0,0,0,0.12);
  border: 1px solid rgba(0,0,0,0.07); z-index: 9999;
  animation: dropIn .16s cubic-bezier(.34,1.56,.64,1);
}
@keyframes dropIn {
  from { opacity:0; transform:translateY(-6px) scale(.97); }
  to { opacity:1; transform:translateY(0) scale(1); }
}
.nav-dropdown-head {
  padding: 10px 12px 9px;
  border-bottom: 1px solid #f5f5f5; margin-bottom: 4px;
}
.nav-dropdown-name { font-size: 0.85rem; font-weight: 800; color: #111; margin: 0; }
.nav-dropdown-role { font-size: 0.68rem; color: #bbb; margin: 1px 0 0; text-transform: capitalize; }
.nav-dropdown-item {
  display: flex; align-items: center; gap: 8px;
  width: 100%; padding: 9px 12px; border-radius: 9px;
  font-size: 0.8rem; font-weight: 600; color: #444;
  background: none; border: none; cursor: pointer;
  text-align: left; transition: background .12s, color .12s;
  font-family: 'Inter', sans-serif;
}
.nav-dropdown-item:hover { background: #f5f5f5; color: #111; }
.nav-dropdown-item.danger { color: #ef4444; }
.nav-dropdown-item.danger:hover { background: #fff5f5; }

/* ── Responsive ── */
.show-md { display: none !important; }
@media(min-width:768px){ .show-md { display: flex !important; } }
.hide-md { display: flex !important; }
@media(min-width:768px){ .hide-md { display: none !important; } }
`;

function Nav() {
  const { userData, currentCity, cartItems } = useSelector((s) => s.user);
  const { myShopData } = useSelector((s) => s.owner);
  const [showInfo, setShowInfo] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // ✅ Guard — don't render until user is known
  if (!userData) return null;

  // ✅ Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowInfo(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogOut = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/signout`, {
        withCredentials: true,
      });
      dispatch(setUserData(null));
      navigate("/signin"); // ✅ redirect after logout
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleSearchItems = useCallback(async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/item/search-items`, {
        params: { query, city: currentCity }, // ✅ cleaner than string interpolation
        withCredentials: true,
      });
      dispatch(setSearchItems(result.data));
    } catch (error) {
      console.error("Search error:", error);
    }
  }, [query, currentCity, dispatch]);

  useEffect(() => {
    if (!query) {
      dispatch(setSearchItems(null));
      return;
    }
    const timer = setTimeout(() => handleSearchItems(), 400);
    return () => clearTimeout(timer);
  }, [query, handleSearchItems]);

  const SearchInner = () => (
    <>
      <div className="nav-search-city">
        <FaLocationDot size={12} color="#1a3c2e" />
        <span className="nav-search-city-text">{currentCity}</span>
      </div>
      <div className="nav-search-field">
        <IoIosSearch size={16} color="#ccc" />
        <input
          type="text"
          placeholder="Search food or restaurants…"
          onChange={(e) => setQuery(e.target.value)}
          value={query}
        />
      </div>
    </>
  );

  return (
    <>
      <style>{css}</style>
      <nav className="nav">
        {showSearch && userData.role === "user" && (
          <div className="nav-mobile-search">
            <SearchInner />
          </div>
        )}

        <div className="nav-logo" onClick={() => navigate("/")}>
          <div className="nav-logo-icon">V</div>
          <span className="nav-logo-text">
            vin<span>go</span>
          </span>
        </div>

        {userData.role === "user" && (
          <div className="nav-search">
            <SearchInner />
          </div>
        )}

        <div className="nav-actions">
          {userData.role === "user" && (
            <button
              className="nav-icon-btn green hide-md"
              onClick={() => setShowSearch((p) => !p)}
            >
              {showSearch ? <RxCross2 size={17} /> : <IoIosSearch size={18} />}
            </button>
          )}

          {userData.role === "owner" ? (
            <>
              {myShopData && (
                <>
                  <button
                    className="nav-btn-green show-md"
                    onClick={() => navigate("/add-item")}
                  >
                    <FaPlus size={11} /> Add Item
                  </button>
                  <button
                    className="nav-icon-btn green hide-md"
                    onClick={() => navigate("/add-item")}
                  >
                    <FaPlus size={15} />
                  </button>
                </>
              )}
              <button
                className="nav-btn-ghost show-md"
                onClick={() => navigate("/my-orders")}
              >
                <TbReceipt2 size={14} /> Orders
              </button>
              <button
                className="nav-icon-btn hide-md"
                onClick={() => navigate("/my-orders")}
              >
                <TbReceipt2 size={17} />
              </button>
            </>
          ) : (
            <>
              {userData.role === "user" && (
                <div className="nav-cart" onClick={() => navigate("/cart")}>
                  <FiShoppingCart size={18} />
                  {cartItems?.length > 0 && (
                    <span className="nav-cart-badge">{cartItems.length}</span>
                  )}
                </div>
              )}
              <button
                className="nav-btn-ghost show-md"
                onClick={() => navigate("/my-orders")}
              >
                Orders
              </button>
            </>
          )}

          {/* ✅ ref added for outside click detection */}
          <div className="nav-avatar-wrap" ref={dropdownRef}>
            <button
              className="nav-avatar-btn"
              onClick={() => setShowInfo((p) => !p)}
            >
              {userData.fullName.slice(0, 1).toUpperCase()}
            </button>
            {showInfo && (
              <div className="nav-dropdown">
                <div className="nav-dropdown-head">
                  <p className="nav-dropdown-name">{userData.fullName}</p>
                  <p className="nav-dropdown-role">{userData.role}</p>
                </div>
                {userData.role === "user" && (
                  <button
                    className="nav-dropdown-item hide-md"
                    style={{ display: "flex" }}
                    onClick={() => {
                      navigate("/my-orders");
                      setShowInfo(false);
                    }}
                  >
                    <TbReceipt2 size={14} /> My Orders
                  </button>
                )}
                <button
                  className="nav-dropdown-item danger"
                  onClick={() => {
                    handleLogOut();
                    setShowInfo(false);
                  }}
                >
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}

export default Nav;
