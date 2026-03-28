import React, { useEffect, useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaUtensils } from "react-icons/fa";
import { FiUploadCloud, FiEdit3 } from "react-icons/fi";
import { MdStorefront } from "react-icons/md";
import axios from "axios";
import { serverUrl } from "../App";
import { setMyShopData } from "../redux/ownerSlice";
import { ClipLoader } from "react-spinners";

const css = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

.ces-page {
  font-family: 'Inter', sans-serif;
  min-height: 100vh;
  background: #f8f8f9;
  display: flex; align-items: center; justify-content: center;
  padding: 80px 16px 40px;
  position: relative;
}

/* ── Back btn ── */
.ces-back {
  position: fixed; top: 16px; left: 16px; z-index: 100;
  width: 38px; height: 38px; border-radius: 12px;
  background: rgba(255,255,255,0.9);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(0,0,0,0.08);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; color: #555;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  transition: all .15s;
}
.ces-back:hover { background: #fff; color: #111; transform: translateX(-2px); box-shadow: 0 4px 14px rgba(0,0,0,0.1); }

/* ── Card ── */
.ces-card {
  width: 100%; max-width: 540px;
  background: #fff; border-radius: 24px;
  border: 1px solid rgba(0,0,0,0.06);
  box-shadow: 0 4px 12px rgba(0,0,0,0.05), 0 20px 60px rgba(0,0,0,0.08);
  overflow: hidden;
}

/* ── Header ── */
.ces-header {
  padding: 32px 32px 24px;
  background: linear-gradient(135deg, #1a3c2e 0%, #2d6a4f 100%);
  display: flex; flex-direction: column; align-items: center;
  gap: 12px; text-align: center; position: relative; overflow: hidden;
}
.ces-header::before {
  content: ''; position: absolute; right: -40px; top: -40px;
  width: 180px; height: 180px; border-radius: 50%;
  background: rgba(255,200,0,0.08);
}
.ces-header::after {
  content: ''; position: absolute; left: -30px; bottom: -40px;
  width: 140px; height: 140px; border-radius: 50%;
  background: rgba(255,255,255,0.04);
}
.ces-header-icon {
  width: 60px; height: 60px; border-radius: 18px;
  background: rgba(255,255,255,0.12);
  border: 1px solid rgba(255,255,255,0.18);
  display: flex; align-items: center; justify-content: center;
  position: relative; z-index: 1;
}
.ces-header-title {
  font-size: 1.4rem; font-weight: 800; color: #fff;
  letter-spacing: -0.4px; margin: 0; position: relative; z-index: 1;
}
.ces-header-sub {
  font-size: 0.78rem; color: rgba(255,255,255,0.55);
  margin: 0; position: relative; z-index: 1;
}

/* ── Form body ── */
.ces-body { padding: 28px 32px 32px; display: flex; flex-direction: column; gap: 18px; }

/* ── Field ── */
.ces-field { display: flex; flex-direction: column; gap: 6px; }
.ces-label {
  font-size: 0.72rem; font-weight: 700; color: #666;
  text-transform: uppercase; letter-spacing: 0.5px;
}
.ces-input {
  width: 100%; padding: 11px 14px;
  background: #f8f8f9; border: 1.5px solid #ececec;
  border-radius: 12px; font-size: 0.88rem; color: #111;
  font-family: 'Inter', sans-serif; outline: none;
  transition: border-color .2s, box-shadow .2s, background .2s;
}
.ces-input:focus {
  border-color: #1a3c2e;
  box-shadow: 0 0 0 3px rgba(26,60,46,0.08);
  background: #fff;
}
.ces-input::placeholder { color: #ccc; }

/* ── Row ── */
.ces-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

/* ── Image upload ── */
.ces-upload {
  width: 100%; border: 2px dashed #e0e0e0;
  border-radius: 14px; background: #f8f8f9;
  cursor: pointer; position: relative;
  overflow: hidden; transition: all .2s;
  min-height: 110px;
  display: flex; align-items: center; justify-content: center;
}
.ces-upload:hover { border-color: #1a3c2e; background: rgba(26,60,46,0.03); }
.ces-upload input[type="file"] {
  position: absolute; inset: 0; opacity: 0; cursor: pointer; z-index: 2;
}
.ces-upload-placeholder {
  display: flex; flex-direction: column; align-items: center;
  gap: 8px; padding: 20px; text-align: center;
}
.ces-upload-icon { color: #bbb; transition: color .2s; }
.ces-upload:hover .ces-upload-icon { color: #1a3c2e; }
.ces-upload-text { font-size: 0.8rem; font-weight: 600; color: #888; }
.ces-upload-sub { font-size: 0.7rem; color: #bbb; }

.ces-preview-wrap { position: relative; width: 100%; }
.ces-preview {
  width: 100%; height: 200px; object-fit: cover;
  display: block; border-radius: 12px;
}
.ces-preview-change {
  position: absolute; bottom: 10px; right: 10px;
  background: rgba(0,0,0,0.6); color: #fff;
  border: none; border-radius: 8px; padding: 6px 12px;
  font-size: 0.72rem; font-weight: 700; cursor: pointer;
  display: flex; align-items: center; gap: 5px;
  font-family: 'Inter', sans-serif;
  backdrop-filter: blur(8px); transition: background .15s;
}
.ces-preview-change:hover { background: rgba(0,0,0,0.8); }

/* ── Error ── */
.ces-error {
  background: #fff5f5; border: 1px solid #fecaca;
  border-radius: 10px; padding: 9px 13px;
  font-size: 0.76rem; font-weight: 600; color: #dc2626;
  display: flex; align-items: center; gap: 5px;
}

/* ── Submit ── */
.ces-submit {
  width: 100%; padding: 13px;
  background: linear-gradient(135deg, #1a3c2e, #2d6a4f);
  color: #fff; border: none; border-radius: 13px;
  font-size: 0.88rem; font-weight: 800; cursor: pointer;
  font-family: 'Inter', sans-serif; letter-spacing: -0.1px;
  box-shadow: 0 4px 16px rgba(26,60,46,0.3);
  display: flex; align-items: center; justify-content: center; gap: 8px;
  transition: all .15s; margin-top: 4px;
}
.ces-submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 6px 22px rgba(26,60,46,0.42); }
.ces-submit:disabled { opacity: .65; cursor: not-allowed; }

/* ── Divider ── */
.ces-divider {
  display: flex; align-items: center; gap: 10px;
  color: #ddd; font-size: 0.7rem; font-weight: 600; color: #bbb;
}
.ces-divider::before, .ces-divider::after {
  content: ''; flex: 1; height: 1px; background: #efefef;
}
`;

function CreateEditShop() {
  const navigate = useNavigate();
  const { myShopData } = useSelector((state) => state.owner);
  const { currentCity, currentState, currentAddress } = useSelector((state) => state.user);
  const [imageError, setImageError] = useState("");
  const [name, setName] = useState(myShopData?.name || "");
  const [address, setAddress] = useState(myShopData?.address || currentAddress || "");
  const [city, setCity] = useState(myShopData?.city || currentCity || "");
  const [state, setState] = useState(myShopData?.state || currentState || "");
  const [frontendImage, setFrontendImage] = useState(myShopData?.image || null);
  const [backendImage, setBackendImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    return () => { if (frontendImage) URL.revokeObjectURL(frontendImage); };
  }, [frontendImage]);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBackendImage(file);
      setFrontendImage(URL.createObjectURL(file));
      setImageError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!backendImage && !myShopData?.image) {
      setImageError("Please upload a shop photo to continue.");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("city", city);
      formData.append("state", state);
      formData.append("address", address);
      if (backendImage) formData.append("image", backendImage);
      const result = await axios.post(
        `${serverUrl}/api/shop/create-edit`,
        formData,
        { withCredentials: true }
      );
      dispatch(setMyShopData(result.data));
      setLoading(false);
      navigate("/");
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const isEdit = !!myShopData;

  return (
    <>
      <style>{css}</style>
      <div className="ces-page">

        {/* Back */}
        <div className="ces-back" onClick={() => navigate("/")}>
          <IoIosArrowRoundBack size={20} />
        </div>

        <div className="ces-card">

          {/* Header */}
          <div className="ces-header">
            <div className="ces-header-icon">
              {isEdit
                ? <FiEdit3 style={{ color: '#ffc800', fontSize: '1.4rem' }} />
                : <MdStorefront style={{ color: '#ffc800', fontSize: '1.5rem' }} />
              }
            </div>
            <h1 className="ces-header-title">
              {isEdit ? "Edit Restaurant" : "List Your Restaurant"}
            </h1>
            <p className="ces-header-sub">
              {isEdit
                ? "Update your restaurant details and menu"
                : "Join Vingo and reach thousands of hungry customers"
              }
            </p>
          </div>

          {/* Form */}
          <form className="ces-body" onSubmit={handleSubmit}>

            {/* Restaurant name */}
            <div className="ces-field">
              <label className="ces-label">Restaurant Name</label>
              <input
                type="text" className="ces-input"
                placeholder="e.g. Spice Garden, Pizza Palace…"
                onChange={e => setName(e.target.value)} value={name}
              />
            </div>

            {/* Image upload */}
            <div className="ces-field">
              <label className="ces-label">Restaurant Photo</label>
              {frontendImage ? (
                <div className="ces-preview-wrap">
                  <img src={frontendImage} alt="preview" className="ces-preview" />
                  <label className="ces-preview-change">
                    <FiUploadCloud size={12} /> Change Photo
                    <input
                      type="file" accept="image/*"
                      style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
                      onChange={handleImage}
                    />
                  </label>
                </div>
              ) : (
                <div className="ces-upload">
                  <input type="file" accept="image/*" onChange={handleImage} />
                  <div className="ces-upload-placeholder">
                    <FiUploadCloud size={30} className="ces-upload-icon" />
                    <span className="ces-upload-text">Click to upload restaurant photo</span>
                    <span className="ces-upload-sub">PNG, JPG up to 5MB</span>
                  </div>
                </div>
              )}
              {imageError && (
                <div className="ces-error">⚠ {imageError}</div>
              )}
            </div>

            <div className="ces-divider">Location Details</div>

            {/* City + State */}
            <div className="ces-row">
              <div className="ces-field">
                <label className="ces-label">City</label>
                <input
                  type="text" className="ces-input"
                  placeholder="e.g. Mumbai"
                  onChange={e => setCity(e.target.value)} value={city}
                />
              </div>
              <div className="ces-field">
                <label className="ces-label">State</label>
                <input
                  type="text" className="ces-input"
                  placeholder="e.g. Maharashtra"
                  onChange={e => setState(e.target.value)} value={state}
                />
              </div>
            </div>

            {/* Address */}
            <div className="ces-field">
              <label className="ces-label">Full Address</label>
              <input
                type="text" className="ces-input"
                placeholder="Street, Area, Landmark…"
                onChange={e => setAddress(e.target.value)} value={address}
              />
            </div>

            {/* Submit */}
            <button className="ces-submit" disabled={loading}>
              {loading
                ? <ClipLoader size={18} color="#fff" />
                : isEdit ? "Save Changes →" : "List Restaurant →"
              }
            </button>

          </form>
        </div>
      </div>
    </>
  );
}

export default CreateEditShop;