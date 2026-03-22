// CategoryCard.jsx
import React from 'react'

const css = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@500;600;700&display=swap');
.catc {
  font-family: 'Inter', sans-serif;
  width: 108px; height: 108px; border-radius: 18px;
  overflow: hidden; position: relative; cursor: pointer; flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04);
  transition: transform .2s cubic-bezier(.34,1.56,.64,1), box-shadow .2s;
}
@media(min-width:768px){ .catc { width: 155px; height: 155px; border-radius: 20px; } }
.catc:hover { transform: translateY(-4px) scale(1.02); box-shadow: 0 8px 28px rgba(0,0,0,0.14); }
.catc:hover .catc-img { transform: scale(1.08); }
.catc-img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform .3s ease; }
.catc-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(180deg, transparent 35%, rgba(0,0,0,0.7) 100%);
}
.catc-label {
  position: absolute; bottom: 0; left: 0; right: 0;
  padding: 20px 10px 10px;
  display: flex; align-items: flex-end; justify-content: center;
}
.catc-label span {
  font-size: 0.72rem; font-weight: 700; color: #fff;
  text-align: center; line-height: 1.2;
  text-shadow: 0 1px 3px rgba(0,0,0,0.4);
}
@media(min-width:768px){ .catc-label span { font-size: 0.82rem; } }
`;

function CategoryCard({ name, image, onClick }) {
  return (
    <>
      <style>{css}</style>
      <div className="catc" onClick={onClick}>
        <img src={image} alt={name} className="catc-img" />
        <div className="catc-overlay" />
        <div className="catc-label"><span>{name}</span></div>
      </div>
    </>
  )
}

export default CategoryCard