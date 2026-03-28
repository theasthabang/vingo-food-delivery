import axios from 'axios';
import React from 'react'
import { FaPen, FaTrashAlt } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { serverUrl } from '../App';
import { useDispatch } from 'react-redux';
import { setMyShopData } from '../redux/ownerSlice';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

  .oitem-card {
    font-family: 'DM Sans', sans-serif;
    display: flex;
    background: #fff;
    border-radius: 18px;
    overflow: hidden;
    box-shadow: 0 2px 14px rgba(0,0,0,0.06);
    border: 1px solid #f5f5f5;
    width: 100%;
    transition: box-shadow .2s, transform .2s;
  }
  .oitem-card:hover {
    box-shadow: 0 6px 28px rgba(255,77,45,0.1);
    transform: translateY(-2px);
  }

  .oitem-img {
    width: 110px; flex-shrink: 0;
    object-fit: cover; display: block;
  }
  @media(min-width:480px){ .oitem-img { width: 130px; } }

  .oitem-body {
    flex: 1; padding: 14px 16px;
    display: flex; flex-direction: column; justify-content: space-between;
    min-width: 0;
  }

  .oitem-name {
    font-size: 0.92rem; font-weight: 700; color: #ff4d2d;
    margin: 0 0 6px; white-space: nowrap;
    overflow: hidden; text-overflow: ellipsis;
  }

  .oitem-meta {
    font-size: 0.78rem; color: #888; margin: 0 0 2px;
  }
  .oitem-meta strong { color: #555; font-weight: 600; }

  .oitem-footer {
    display: flex; align-items: center; justify-content: space-between;
    margin-top: 10px;
  }

  .oitem-price {
    font-size: 1rem; font-weight: 800; color: #1a1a1a;
  }

  .oitem-actions { display: flex; align-items: center; gap: 6px; }

  .oitem-action-btn {
    width: 34px; height: 34px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; border: none; background: rgba(255,77,45,0.08);
    color: #ff4d2d; transition: background .15s, transform .1s;
  }
  .oitem-action-btn:hover { background: rgba(255,77,45,0.16); transform: scale(1.08); }
  .oitem-action-btn.delete:hover { background: #fff0ee; color: #e63e20; }
`;

function OwnerItemCard({ data }) {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleDelete = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/item/delete/${data._id}`, { withCredentials: true })
      dispatch(setMyShopData(result.data))
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <style>{styles}</style>
      <div className="oitem-card">
        <img src={data.image} alt={data.name} className="oitem-img" />
        <div className="oitem-body">
          <div>
            <p className="oitem-name">{data.name}</p>
            <p className="oitem-meta"><strong>Category:</strong> {data.category}</p>
            <p className="oitem-meta"><strong>Type:</strong> {data.foodType}</p>
          </div>
          <div className="oitem-footer">
            <span className="oitem-price">₹{data.price}</span>
            <div className="oitem-actions">
              <button className="oitem-action-btn" onClick={() => navigate(`/edit-item/${data._id}`)}>
                <FaPen size={13} />
              </button>
              <button className="oitem-action-btn delete" onClick={handleDelete}>
                <FaTrashAlt size={13} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default OwnerItemCard