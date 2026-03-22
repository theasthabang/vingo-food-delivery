import React, { useEffect, useState } from 'react'
import { IoIosArrowRoundBack } from "react-icons/io";
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { FiUploadCloud, FiEdit3 } from "react-icons/fi";
import axios from 'axios';
import { serverUrl } from '../App';
import { setMyShopData } from '../redux/ownerSlice';
import { ClipLoader } from 'react-spinners';

const css = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

.ei-page {
  font-family: 'Inter', sans-serif;
  min-height: 100vh; background: #f8f8f9;
  display: flex; align-items: center; justify-content: center;
  padding: 80px 16px 40px; position: relative;
}

/* Back */
.ei-back {
  position: fixed; top: 16px; left: 16px; z-index: 100;
  width: 38px; height: 38px; border-radius: 12px;
  background: rgba(255,255,255,0.9); backdrop-filter: blur(12px);
  border: 1px solid rgba(0,0,0,0.08);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; color: #555;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08); transition: all .15s;
}
.ei-back:hover { background: #fff; color: #111; transform: translateX(-2px); }

/* Card */
.ei-card {
  width: 100%; max-width: 520px; background: #fff;
  border-radius: 24px; border: 1px solid rgba(0,0,0,0.06);
  box-shadow: 0 4px 12px rgba(0,0,0,0.05), 0 20px 60px rgba(0,0,0,0.08);
  overflow: hidden;
}

/* Header */
.ei-header {
  padding: 28px 32px 22px;
  background: linear-gradient(135deg, #1a3c2e 0%, #2d6a4f 100%);
  display: flex; flex-direction: column; align-items: center;
  gap: 10px; text-align: center; position: relative; overflow: hidden;
}
.ei-header::before {
  content: ''; position: absolute; right: -40px; top: -40px;
  width: 160px; height: 160px; border-radius: 50%;
  background: rgba(255,200,0,0.08);
}
.ei-header::after {
  content: ''; position: absolute; left: -20px; bottom: -30px;
  width: 120px; height: 120px; border-radius: 50%;
  background: rgba(255,255,255,0.04);
}
.ei-header-icon {
  width: 52px; height: 52px; border-radius: 15px;
  background: rgba(255,255,255,0.12);
  border: 1px solid rgba(255,255,255,0.18);
  display: flex; align-items: center; justify-content: center;
  position: relative; z-index: 1;
}
.ei-header-title {
  font-size: 1.3rem; font-weight: 800; color: #fff;
  letter-spacing: -0.4px; margin: 0; position: relative; z-index: 1;
}
.ei-header-sub {
  font-size: 0.76rem; color: rgba(255,255,255,0.55);
  margin: 0; position: relative; z-index: 1;
}

/* Skeleton loader */
.ei-skeleton-body {
  padding: 28px 32px 32px;
  display: flex; flex-direction: column; gap: 18px;
}
.ei-skeleton-field { display: flex; flex-direction: column; gap: 6px; }
.ei-skeleton-label {
  width: 80px; height: 10px; border-radius: 5px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}
.ei-skeleton-input {
  width: 100%; height: 44px; border-radius: 12px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}
.ei-skeleton-img {
  width: 100%; height: 160px; border-radius: 12px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}
@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Form body */
.ei-body { padding: 28px 32px 32px; display: flex; flex-direction: column; gap: 18px; }

/* Field */
.ei-field { display: flex; flex-direction: column; gap: 6px; }
.ei-label {
  font-size: 0.72rem; font-weight: 700; color: #666;
  text-transform: uppercase; letter-spacing: 0.5px;
}
.ei-input {
  width: 100%; padding: 11px 14px;
  background: #f8f8f9; border: 1.5px solid #ececec;
  border-radius: 12px; font-size: 0.88rem; color: #111;
  font-family: 'Inter', sans-serif; outline: none;
  transition: border-color .2s, box-shadow .2s, background .2s;
}
.ei-input:focus {
  border-color: #1a3c2e;
  box-shadow: 0 0 0 3px rgba(26,60,46,0.08);
  background: #fff;
}
.ei-input::placeholder { color: #ccc; }

/* Select */
.ei-select {
  width: 100%; padding: 11px 14px;
  background: #f8f8f9; border: 1.5px solid #ececec;
  border-radius: 12px; font-size: 0.88rem; color: #111;
  font-family: 'Inter', sans-serif; outline: none;
  transition: border-color .2s, box-shadow .2s;
  appearance: none; cursor: pointer;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23999' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat; background-position: right 14px center;
}
.ei-select:focus {
  border-color: #1a3c2e; background-color: #fff;
  box-shadow: 0 0 0 3px rgba(26,60,46,0.08);
}

/* Row */
.ei-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

/* Food type toggle */
.ei-type-row { display: flex; gap: 8px; }
.ei-type-btn {
  flex: 1; padding: 10px 8px; border-radius: 10px;
  border: 1.5px solid #e5e5e5; background: #f8f8f9;
  font-size: 0.8rem; font-weight: 700; cursor: pointer;
  display: flex; align-items: center; justify-content: center; gap: 6px;
  transition: all .15s; font-family: 'Inter', sans-serif; color: #666;
}
.ei-type-btn.veg.active { background: #dcfce7; border-color: #16a34a; color: #16a34a; }
.ei-type-btn.nonveg.active { background: #fee2e2; border-color: #dc2626; color: #dc2626; }
.ei-type-btn:hover { transform: translateY(-1px); }

/* Image upload */
.ei-upload {
  width: 100%; border: 2px dashed #e0e0e0; border-radius: 14px;
  background: #f8f8f9; cursor: pointer; position: relative;
  overflow: hidden; transition: all .2s;
  min-height: 100px;
  display: flex; align-items: center; justify-content: center;
}
.ei-upload:hover { border-color: #1a3c2e; background: rgba(26,60,46,0.03); }
.ei-upload input[type="file"] {
  position: absolute; inset: 0; opacity: 0; cursor: pointer; z-index: 2;
}
.ei-upload-inner {
  display: flex; flex-direction: column; align-items: center;
  gap: 7px; padding: 18px; text-align: center;
}
.ei-upload-icon { color: #bbb; transition: color .2s; }
.ei-upload:hover .ei-upload-icon { color: #1a3c2e; }
.ei-upload-text { font-size: 0.78rem; font-weight: 600; color: #888; }
.ei-upload-sub { font-size: 0.68rem; color: #bbb; }

/* Preview */
.ei-preview-wrap { position: relative; width: 100%; }
.ei-preview {
  width: 100%; height: 190px; object-fit: cover;
  display: block; border-radius: 12px;
  border: 1px solid rgba(0,0,0,0.06);
}
.ei-preview-change {
  position: absolute; bottom: 10px; right: 10px;
  background: rgba(0,0,0,0.6); color: #fff;
  border: none; border-radius: 8px; padding: 6px 12px;
  font-size: 0.72rem; font-weight: 700; cursor: pointer;
  display: flex; align-items: center; gap: 5px;
  font-family: 'Inter', sans-serif;
  backdrop-filter: blur(8px); transition: background .15s;
}
.ei-preview-change:hover { background: rgba(0,0,0,0.82); }

/* Submit */
.ei-submit {
  width: 100%; padding: 13px;
  background: linear-gradient(135deg, #1a3c2e, #2d6a4f);
  color: #fff; border: none; border-radius: 13px;
  font-size: 0.88rem; font-weight: 800; cursor: pointer;
  font-family: 'Inter', sans-serif; letter-spacing: -0.1px;
  box-shadow: 0 4px 16px rgba(26,60,46,0.3);
  display: flex; align-items: center; justify-content: center; gap: 8px;
  transition: all .15s; margin-top: 4px;
}
.ei-submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 6px 22px rgba(26,60,46,0.42); }
.ei-submit:disabled { opacity: .65; cursor: not-allowed; }

/* Divider */
.ei-divider {
  display: flex; align-items: center; gap: 10px;
  font-size: 0.7rem; font-weight: 600; color: #bbb;
}
.ei-divider::before, .ei-divider::after {
  content: ''; flex: 1; height: 1px; background: #efefef;
}
`;

function EditItem() {
  const navigate = useNavigate()
  const { itemId } = useParams()
  const [currentItem, setCurrentItem] = useState(null)
  const [name, setName] = useState("")
  const [price, setPrice] = useState(0)
  const [frontendImage, setFrontendImage] = useState("")
  const [backendImage, setBackendImage] = useState(null)
  const [category, setCategory] = useState("")
  const [foodType, setFoodType] = useState("")
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
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
      const result = await axios.post(`${serverUrl}/api/item/edit-item/${itemId}`, formData, { withCredentials: true })
      dispatch(setMyShopData(result.data))
      setLoading(false)
      navigate("/")
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  useEffect(() => {
    const fetchItem = async () => {
      setFetching(true)
      try {
        const result = await axios.get(`${serverUrl}/api/item/get-by-id/${itemId}`, { withCredentials: true })
        setCurrentItem(result.data)
      } catch (error) { console.log(error) }
      finally { setFetching(false) }
    }
    fetchItem()
  }, [itemId])

  useEffect(() => {
    setName(currentItem?.name || "")
    setPrice(currentItem?.price || 0)
    setCategory(currentItem?.category || "")
    setFoodType(currentItem?.foodType || "")
    setFrontendImage(currentItem?.image || "")
  }, [currentItem])

  return (
    <>
      <style>{css}</style>
      <div className="ei-page">

        {/* Back */}
        <div className="ei-back" onClick={() => navigate("/")}>
          <IoIosArrowRoundBack size={20} />
        </div>

        <div className="ei-card">

          {/* Header */}
          <div className="ei-header">
            <div className="ei-header-icon">
              <FiEdit3 style={{ color: '#ffc800', fontSize: '1.3rem' }} />
            </div>
            <h1 className="ei-header-title">Edit Food Item</h1>
            <p className="ei-header-sub">Update your dish details and pricing</p>
          </div>

          {/* Skeleton while loading */}
          {fetching ? (
            <div className="ei-skeleton-body">
              <div className="ei-skeleton-field">
                <div className="ei-skeleton-label" />
                <div className="ei-skeleton-input" />
              </div>
              <div className="ei-skeleton-field">
                <div className="ei-skeleton-label" />
                <div className="ei-skeleton-img" />
              </div>
              <div className="ei-skeleton-field">
                <div className="ei-skeleton-label" />
                <div className="ei-skeleton-input" />
              </div>
              <div className="ei-skeleton-field">
                <div className="ei-skeleton-label" />
                <div className="ei-skeleton-input" />
              </div>
            </div>
          ) : (
            <form className="ei-body" onSubmit={handleSubmit}>

              {/* Name */}
              <div className="ei-field">
                <label className="ei-label">Dish Name</label>
                <input
                  type="text" className="ei-input"
                  placeholder="Enter dish name…"
                  onChange={e => setName(e.target.value)} value={name}
                />
              </div>

              {/* Image */}
              <div className="ei-field">
                <label className="ei-label">Food Image</label>
                {frontendImage ? (
                  <div className="ei-preview-wrap">
                    <img src={frontendImage} alt={name} className="ei-preview" />
                    <label className="ei-preview-change">
                      <FiUploadCloud size={11} /> Change
                      <input
                        type="file" accept="image/*"
                        style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
                        onChange={handleImage}
                      />
                    </label>
                  </div>
                ) : (
                  <div className="ei-upload">
                    <input type="file" accept="image/*" onChange={handleImage} />
                    <div className="ei-upload-inner">
                      <FiUploadCloud size={26} className="ei-upload-icon" />
                      <span className="ei-upload-text">Click to upload image</span>
                      <span className="ei-upload-sub">PNG, JPG up to 5MB</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="ei-divider">Details</div>

              {/* Price + Category */}
              <div className="ei-row">
                <div className="ei-field">
                  <label className="ei-label">Price (₹)</label>
                  <input
                    type="number" className="ei-input"
                    placeholder="0"
                    onChange={e => setPrice(e.target.value)} value={price}
                  />
                </div>
                <div className="ei-field">
                  <label className="ei-label">Category</label>
                  <select className="ei-select" onChange={e => setCategory(e.target.value)} value={category}>
                    <option value="">Select…</option>
                    {categories.map((c, i) => <option key={i} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {/* Food type */}
              <div className="ei-field">
                <label className="ei-label">Food Type</label>
                <div className="ei-type-row">
                  <button
                    type="button"
                    className={"ei-type-btn veg" + (foodType === "veg" ? " active" : "")}
                    onClick={() => setFoodType("veg")}
                  >🥦 Vegetarian</button>
                  <button
                    type="button"
                    className={"ei-type-btn nonveg" + (foodType === "non veg" ? " active" : "")}
                    onClick={() => setFoodType("non veg")}
                  >🍗 Non-Veg</button>
                </div>
              </div>

              {/* Submit */}
              <button className="ei-submit" disabled={loading}>
                {loading ? <ClipLoader size={18} color="#fff" /> : "Save Changes →"}
              </button>

            </form>
          )}
        </div>
      </div>
    </>
  )
}

export default EditItem