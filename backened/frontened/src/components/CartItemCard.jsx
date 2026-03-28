import React from 'react'
import { FaMinus, FaPlus } from "react-icons/fa";
import { CiTrash } from "react-icons/ci";
import { useDispatch } from "react-redux";
import { removeCartItem, updateQuantity } from "../redux/userSlice.js";

const css = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
.cic {
  font-family: 'Inter', sans-serif;
  display: flex; align-items: center; gap: 14px;
  background: #fff; border-radius: 16px; padding: 12px 14px;
  border: 1px solid rgba(0,0,0,0.06);
  box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.04);
  transition: transform .18s, box-shadow .18s;
}
.cic:hover { transform: translateY(-2px); box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
.cic-img {
  width: 70px; height: 70px; border-radius: 12px;
  object-fit: cover; flex-shrink: 0;
  border: 1px solid rgba(0,0,0,0.05);
}
.cic-info { flex: 1; min-width: 0; }
.cic-name {
  font-size: 0.85rem; font-weight: 700; color: #111; margin: 0 0 3px;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.cic-meta { font-size: 0.72rem; color: #aaa; margin: 0 0 4px; }
.cic-total {
  font-size: 0.9rem; font-weight: 800; color: #111; margin: 0;
  background: linear-gradient(135deg, #ff4d2d, #ff7a00);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  background-clip: text;
}
.cic-right { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
.cic-qty {
  display: flex; align-items: center;
  background: #f6f6f6; border-radius: 50px;
  border: 1px solid #ececec; padding: 2px;
}
.cic-qb {
  width: 26px; height: 26px; border-radius: 50%;
  background: none; border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  color: #666; transition: background .12s; font-size: 0.7rem;
}
.cic-qb:hover { background: #e5e5e5; color: #111; }
.cic-qv { font-size: 0.8rem; font-weight: 700; color: #111; min-width: 20px; text-align: center; }
.cic-del {
  width: 30px; height: 30px; border-radius: 9px;
  background: #fff4f2; border: 1px solid rgba(255,77,45,0.15);
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  color: #ff4d2d; transition: all .12s;
}
.cic-del:hover { background: #ffe8e4; transform: scale(1.08); }
`;

function CartItemCard({ data }) {
  const dispatch = useDispatch()
  const inc = (id, q) => dispatch(updateQuantity({ id, quantity: q + 1 }))
  const dec = (id, q) => { if (q > 1) dispatch(updateQuantity({ id, quantity: q - 1 })) }
  return (
    <>
      <style>{css}</style>
      <div className="cic">
        <img src={data.image} alt={data.name} className="cic-img" />
        <div className="cic-info">
          <p className="cic-name">{data.name}</p>
          <p className="cic-meta">₹{data.price} × {data.quantity}</p>
          <p className="cic-total">₹{data.price * data.quantity}</p>
        </div>
        <div className="cic-right">
          <div className="cic-qty">
            <button className="cic-qb" onClick={() => dec(data.id, data.quantity)}><FaMinus size={8} /></button>
            <span className="cic-qv">{data.quantity}</span>
            <button className="cic-qb" onClick={() => inc(data.id, data.quantity)}><FaPlus size={8} /></button>
          </div>
          <button className="cic-del" onClick={() => dispatch(removeCartItem(data.id))}><CiTrash size={15} /></button>
        </div>
      </div>
    </>
  )
}

export default CartItemCard