import React, { useState } from 'react'
import { IoIosArrowRoundBack } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaUtensils } from "react-icons/fa";
import { FiUploadCloud } from "react-icons/fi";
import axios from 'axios';
import { serverUrl } from '../App';
import { setMyShopData } from '../redux/ownerSlice';
import { ClipLoader } from 'react-spinners';

const css = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

.ai-page {
  font-family: 'Inter', sans-serif;
  min-height: 100vh;
  background: #f8f8f9;
  display: flex; align-items: center; justify-content: center;
  padding: 24px 16px;
  position: relative;
}

/* back button */
.ai-back {
  position: fixed; top: 20px; left: 20px; z-index: 100;
  width: 38px; height: 38px; border-radius: 12px;
  background: #fff; border: 1px solid #e5e5e5;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; color: #555;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  transition: all .15s;
}
.ai-back:hover { background: #f5f5f5; color: #111; transform: translateX(-2px); }

/* card */
.ai-card {
  width: 100%; max-width: 520px;
  background: #fff; border-radius: 24px;
  border: 1px solid rgba(0,0,0,0.06);
  box-shadow: 0 4px 12px rgba(0,0,0,0.05), 0 20px 60px rgba(0,0,0,0.08);
  overflow: hidden;
}

/* card header */
.ai-card-header {
  padding: 32px 32px 24px;
  background: linear-gradient(135deg, #1a3c2e 0%, #2d6a4f 100%);
  display: flex; flex-direction: column; align-items: center;
  gap: 12px; text-align: center; position: relative; overflow: hidden;
}
.ai-card-header::before {
  content: ''; position: absolute; right: -40px; top: -40px;
  width: 160px; height: 160px; border-radius: 50%;
  background: rgba(255,200,0,0.08);
}
.ai-card-header::after {
  content: ''; position: absolute; left: -20px; bottom: -30px;
  width: 120px; height: 120px; border-radius: 50%;
  background: rgba(255,255,255,0.04);
}
.ai-header-icon {
  width: 56px; height: 56px; border-radius: 16px;
  background: rgba(255,255,255,0.15);
  border: 1px solid rgba(255,255,255,0.2);
  display: flex; align-items: center; justify-content: center;
  position: relative; z-index: 1;
}
.ai-header-title {
  font-size: 1.4rem; font-weight: 800; color: #fff;
  letter-spacing: -0.4px; margin: 0; position: relative; z-index: 1;
}
.ai-header-sub {
  font-size: 0.78rem; color: rgba(255,255,255,0.6);
  margin: 0; position: relative; z-index: 1;
}

/* form body */
.ai-form-body { padding: 28px 32px 32px; display: flex; flex-direction: column; gap: 18px; }

/* field */
.ai-field { display: flex; flex-direction: column; gap: 6px; }
.ai-label {
  font-size: 0.78rem; font-weight: 700; color: #555;
  text-transform: uppercase; letter-spacing: 0.5px;
}
.ai-input {
  width: 100%; padding: 11px 14px;
  background: #f8f8f9; border: 1.5px solid #ececec;
  border-radius: 12px; font-size: 0.88rem; color: #111;
  font-family: 'Inter', sans-serif; outline: none;
  transition: border-color .2s, box-shadow .2s, background .2s;
}
.ai-input:focus {
  border-color: #1a3c2e;
  box-shadow: 0 0 0 3px rgba(26,60,46,0.08);
  background: #fff;
}
.ai-input::placeholder { color: #ccc; }

/* file upload */
.ai-upload-box {
  width: 100%; padding: 20px;
  background: #f8f8f9; border: 2px dashed #e0e0e0;
  border-radius: 12px; cursor: pointer;
  display: flex; flex-direction: column; align-items: center; gap: 8px;
  transition: all .2s; position: relative; overflow: hidden;
}
.ai-upload-box:hover { border-color: #1a3c2e; background: rgba(26,60,46,0.03); }
.ai-upload-box input[type="file"] {
  position: absolute; inset: 0; opacity: 0; cursor: pointer; z-index: 2;
}
.ai-upload-icon { color: #aaa; transition: color .2s; }
.ai-upload-box:hover .ai-upload-icon { color: #1a3c2e; }
.ai-upload-text { font-size: 0.8rem; font-weight: 600; color: #888; }
.ai-upload-sub { font-size: 0.7rem; color: #bbb; }

.ai-preview {
  width: 100%; height: 180px; border-radius: 12px;
  object-fit: cover; border: 1px solid #ececec;
  margin-top: 8px;
}

/* row */
.ai-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

/* food type toggle */
.ai-type-toggle { display: flex; gap: 8px; }
.ai-type-btn {
  flex: 1; padding: 10px; border-radius: 10px;
  border: 1.5px solid #e5e5e5; background: #f8f8f9;
  font-size: 0.8rem; font-weight: 700; cursor: pointer;
  display: flex; align-items: center; justify-content: center; gap: 6px;
  transition: all .15s; font-family: 'Inter', sans-serif; color: #666;
}
.ai-type-btn.veg.active { background: #dcfce7; border-color: #16a34a; color: #16a34a; }
.ai-type-btn.nonveg.active { background: #fee2e2; border-color: #dc2626; color: #dc2626; }
.ai-type-btn:hover { transform: translateY(-1px); }

/* submit */
.ai-submit {
  width: 100%; padding: 13px;
  background: linear-gradient(135deg, #1a3c2e, #2d6a4f);
  color: #fff; border: none; border-radius: 12px;
  font-size: 0.88rem; font-weight: 700; cursor: pointer;
  font-family: 'Inter', sans-serif; letter-spacing: -0.1px;
  box-shadow: 0 4px 14px rgba(26,60,46,0.3);
  display: flex; align-items: center; justify-content: center; gap: 8px;
  transition: all .15s; margin-top: 4px;
}
.ai-submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(26,60,46,0.4); }
.ai-submit:disabled { opacity: .65; cursor: not-allowed; }

/* select */
.ai-select {
  width: 100%; padding: 11px 14px;
  background: #f8f8f9; border: 1.5px solid #ececec;
  border-radius: 12px; font-size: 0.88rem; color: #111;
  font-family: 'Inter', sans-serif; outline: none;
  transition: border-color .2s, box-shadow .2s;
  appearance: none; cursor: pointer;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23999' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat; background-position: right 14px center;
}
.ai-select:focus { border-color: #1a3c2e; box-shadow: 0 0 0 3px rgba(26,60,46,0.08); background-color: #fff; }
`;

function AddItem() {
  const navigate = useNavigate()
  const { myShopData } = useSelector(state => state.owner)
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState("")
  const [price, setPrice] = useState(0)
  const [frontendImage, setFrontendImage] = useState(null)
  const [backendImage, setBackendImage] = useState(null)
  const [category, setCategory] = useState("")
  const [foodType, setFoodType] = useState("veg")
  const dispatch = useDispatch()

  const categories = [
    "Snacks", "Main Course", "Desserts", "Pizza", "Burgers",
    "Sandwiches", "South Indian", "North Indian", "Chinese", "Fast Food", "Others"
  ]

  const handleImage = (e) => {
    const file = e.target.files[0]
    setBackendImage(file)
    setFrontendImage(URL.createObjectURL(file))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append("name", name)
      formData.append("category", category)
      formData.append("foodType", foodType)
      formData.append("price", price)
      if (backendImage) formData.append("image", backendImage)
      const result = await axios.post(`${serverUrl}/api/item/add-item`, formData, { withCredentials: true })
      dispatch(setMyShopData(result.data))
      setLoading(false)
      navigate("/")
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  return (
    <>
      <style>{css}</style>
      <div className="ai-page">

        {/* Back button */}
        <div className="ai-back" onClick={() => navigate("/")}>
          <IoIosArrowRoundBack size={22} />
        </div>

        <div className="ai-card">
          {/* Header */}
          <div className="ai-card-header">
            <div className="ai-header-icon">
              <FaUtensils style={{ color: '#ffc800', fontSize: '1.4rem' }} />
            </div>
            <h1 className="ai-header-title">Add Food Item</h1>
            <p className="ai-header-sub">Add a new dish to your restaurant menu</p>
          </div>

          {/* Form */}
          <form className="ai-form-body" onSubmit={handleSubmit}>

            {/* Name */}
            <div className="ai-field">
              <label className="ai-label">Dish Name</label>
              <input
                type="text" className="ai-input"
                placeholder="e.g. Butter Chicken, Margherita Pizza…"
                onChange={e => setName(e.target.value)} value={name}
              />
            </div>

            {/* Image upload */}
            <div className="ai-field">
              <label className="ai-label">Food Image</label>
              <div className="ai-upload-box">
                <input type="file" accept="image/*" onChange={handleImage} />
                {!frontendImage && (
                  <>
                    <FiUploadCloud size={28} className="ai-upload-icon" />
                    <span className="ai-upload-text">Click to upload image</span>
                    <span className="ai-upload-sub">PNG, JPG up to 5MB</span>
                  </>
                )}
                {frontendImage && (
                  <img src={frontendImage} alt="preview" className="ai-preview" />
                )}
              </div>
            </div>

            {/* Price + Category row */}
            <div className="ai-row">
              <div className="ai-field">
                <label className="ai-label">Price (₹)</label>
                <input
                  type="number" className="ai-input"
                  placeholder="0"
                  onChange={e => setPrice(e.target.value)} value={price}
                />
              </div>
              <div className="ai-field">
                <label className="ai-label">Category</label>
                <select className="ai-select" onChange={e => setCategory(e.target.value)} value={category}>
                  <option value="">Select…</option>
                  {categories.map((c, i) => <option key={i} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            {/* Food type toggle */}
            <div className="ai-field">
              <label className="ai-label">Food Type</label>
              <div className="ai-type-toggle">
                <button
                  type="button"
                  className={"ai-type-btn veg" + (foodType === "veg" ? " active" : "")}
                  onClick={() => setFoodType("veg")}
                >
                  🥦 Vegetarian
                </button>
                <button
                  type="button"
                  className={"ai-type-btn nonveg" + (foodType === "non veg" ? " active" : "")}
                  onClick={() => setFoodType("non veg")}
                >
                  🍗 Non-Veg
                </button>
              </div>
            </div>

            {/* Submit */}
            <button className="ai-submit" disabled={loading}>
              {loading ? <ClipLoader size={18} color="#fff" /> : "Add to Menu →"}
            </button>

          </form>
        </div>
      </div>
    </>
  )
}

export default AddItem