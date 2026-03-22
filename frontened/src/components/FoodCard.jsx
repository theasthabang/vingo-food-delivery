import React from 'react'
import { FaLeaf, FaDrumstickBite, FaStar, FaMinus, FaPlus, FaShoppingCart } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeCartItem, updateQuantity } from "../redux/userSlice.js";

const css = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

.fc {
  font-family: 'Inter', sans-serif;
  width: 215px; border-radius: 18px;
  background: #fff; flex-shrink: 0;
  border: 1px solid rgba(0,0,0,0.06);
  box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06);
  overflow: hidden; display: flex; flex-direction: column;
  transition: transform .2s cubic-bezier(.34,1.56,.64,1), box-shadow .2s;
  cursor: default;
}
.fc:hover {
  transform: translateY(-5px);
  box-shadow: 0 2px 4px rgba(0,0,0,0.04), 0 12px 40px rgba(26,60,46,0.12);
}

/* image */
.fc-img-box {
  position: relative; height: 148px;
  overflow: hidden; background: #f8f8f8;
}
.fc-img {
  width: 100%; height: 100%; object-fit: cover;
  display: block; transition: transform .35s ease;
}
.fc:hover .fc-img { transform: scale(1.06); }

/* veg/non-veg badge */
.fc-type-dot {
  position: absolute; top: 10px; right: 10px;
  width: 26px; height: 26px; border-radius: 8px;
  background: rgba(255,255,255,0.95);
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  border: 1px solid rgba(0,0,0,0.05);
}

/* price tag */
.fc-price-tag {
  position: absolute; bottom: 0; left: 0;
  background: linear-gradient(135deg, #1a3c2e, #2d6a4f);
  color: #fff; font-weight: 800; font-size: 0.82rem;
  padding: 4px 12px 4px 10px; border-top-right-radius: 12px;
  letter-spacing: -0.3px;
}

/* body */
.fc-body { flex: 1; padding: 11px 13px 0; }
.fc-name {
  font-size: 0.85rem; font-weight: 700; color: #111; margin: 0 0 5px;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  letter-spacing: -0.2px;
}
.fc-stars { display: flex; align-items: center; gap: 2px; }
.fc-star-count { font-size: 0.68rem; color: #bbb; margin-left: 4px; }

/* footer */
.fc-footer {
  padding: 10px 13px 13px;
  display: flex; align-items: center; justify-content: flex-end;
}
.fc-qty-group {
  display: flex; align-items: center;
  background: #f6f6f6; border-radius: 50px;
  border: 1px solid #ececec; overflow: hidden;
}
.fc-q-btn {
  width: 28px; height: 28px;
  background: none; border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  color: #666; transition: background .12s, color .12s;
}
.fc-q-btn:hover { background: #ebebeb; color: #111; }
.fc-q-val {
  font-size: 0.8rem; font-weight: 700; color: #111;
  min-width: 20px; text-align: center;
}
.fc-cart-btn {
  width: 30px; height: 28px;
  display: flex; align-items: center; justify-content: center;
  border: none; cursor: pointer;
  border-left: 1px solid rgba(0,0,0,0.08);
  transition: background .12s;
}
.fc-cart-btn.added { background: #1a1a1a; }
.fc-cart-btn.add   { background: linear-gradient(135deg, #1a3c2e, #2d6a4f); }
.fc-cart-btn.add:hover { filter: brightness(1.05); }
`;

function FoodCard({ data }) {
  const dispatch = useDispatch()
  const { cartItems } = useSelector(s => s.user)

  const stars = (rating) => [1,2,3,4,5].map(i =>
    i <= rating
      ? <FaStar key={i} style={{ color: '#f59e0b', fontSize: '0.68rem' }} />
      : <FaRegStar key={i} style={{ color: '#f59e0b', fontSize: '0.68rem' }} />
  )

  const cartItem = cartItems.find(i => i.id === data._id)
  const qty = cartItem?.quantity ?? 0

  const increase = () => dispatch(addToCart({ id: data._id, name: data.name, price: data.price, image: data.image, shop: data.shop, quantity: qty + 1, foodType: data.foodType }))
  const decrease = () => {
    if (qty <= 0) return
    if (qty === 1) dispatch(removeCartItem(data._id))
    else dispatch(updateQuantity({ id: data._id, quantity: qty - 1 }))
  }
  const addFirst = () => {
    if (!cartItem) dispatch(addToCart({ id: data._id, name: data.name, price: data.price, image: data.image, shop: data.shop, quantity: 1, foodType: data.foodType }))
  }

  return (
    <>
      <style>{css}</style>
      <div className="fc">
        <div className="fc-img-box">
          <img src={data.image} alt={data.name} className="fc-img" />
          <div className="fc-type-dot">
            {data.foodType === "veg"
              ? <FaLeaf style={{ color: '#16a34a', fontSize: '0.65rem' }} />
              : <FaDrumstickBite style={{ color: '#dc2626', fontSize: '0.65rem' }} />}
          </div>
          <div className="fc-price-tag">₹{data.price}</div>
        </div>

        <div className="fc-body">
          <p className="fc-name">{data.name}</p>
          <div className="fc-stars">
            {stars(data.rating?.average || 0)}
            <span className="fc-star-count">({data.rating?.count || 0})</span>
          </div>
        </div>

        <div className="fc-footer">
          <div className="fc-qty-group">
            <button className="fc-q-btn" onClick={decrease}><FaMinus size={8} /></button>
            <span className="fc-q-val">{qty}</span>
            <button className="fc-q-btn" onClick={increase}><FaPlus size={8} /></button>
            <button className={"fc-cart-btn " + (cartItem ? "added" : "add")} onClick={addFirst}>
              <FaShoppingCart size={11} color="#fff" />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default FoodCard