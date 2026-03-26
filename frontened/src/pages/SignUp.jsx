import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../Firebase";
import { ClipLoader } from "react-spinners";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";
import { MdPerson, MdEmail, MdPhone, MdLock } from "react-icons/md";

const css = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

.su-page {
  font-family: 'Inter', sans-serif;
  min-height: 100vh; width: 100%;
  background: #f8f8f9;
  display: flex; align-items: center; justify-content: center;
  padding: 24px 16px;
}
.su-card {
  width: 100%; max-width: 460px;
  background: #fff; border-radius: 24px;
  border: 1px solid rgba(0,0,0,0.06);
  box-shadow: 0 4px 12px rgba(0,0,0,0.05), 0 20px 60px rgba(0,0,0,0.08);
  overflow: hidden;
  animation: cardIn .45s cubic-bezier(.34,1.56,.64,1);
}
@keyframes cardIn {
  from { opacity:0; transform:scale(.96) translateY(16px); }
  to   { opacity:1; transform:scale(1) translateY(0); }
}
.su-header {
  padding: 28px 32px 22px;
  background: linear-gradient(135deg, #1a3c2e 0%, #2d6a4f 100%);
  position: relative; overflow: hidden;
}
.su-header::before {
  content: ''; position: absolute; right: -40px; top: -40px;
  width: 160px; height: 160px; border-radius: 50%;
  background: rgba(255,200,0,0.09);
}
.su-header::after {
  content: ''; position: absolute; left: -20px; bottom: -30px;
  width: 120px; height: 120px; border-radius: 50%;
  background: rgba(255,255,255,0.04);
}
.su-logo {
  font-size: 1.5rem; font-weight: 900; color: #fff;
  letter-spacing: -0.5px; margin: 0 0 4px;
  position: relative; z-index: 1;
}
.su-logo span { color: #ffc800; }
.su-header-sub {
  font-size: 0.78rem; color: rgba(255,255,255,0.55);
  margin: 0; position: relative; z-index: 1; line-height: 1.5;
}
.su-body { padding: 24px 32px 30px; display: flex; flex-direction: column; gap: 14px; }
.su-field { display: flex; flex-direction: column; gap: 5px; }
.su-label {
  font-size: 0.72rem; font-weight: 700; color: #666;
  text-transform: uppercase; letter-spacing: 0.5px;
}
.su-input-wrap {
  display: flex; align-items: center;
  background: #f8f8f9; border: 1.5px solid #ececec;
  border-radius: 12px; overflow: hidden;
  transition: border-color .2s, box-shadow .2s, background .2s;
}
.su-input-wrap:focus-within {
  border-color: #1a3c2e;
  box-shadow: 0 0 0 3px rgba(26,60,46,0.08);
  background: #fff;
}
.su-input-icon {
  padding: 0 12px; color: #ccc; flex-shrink: 0;
  display: flex; align-items: center; transition: color .2s;
}
.su-input-wrap:focus-within .su-input-icon { color: #1a3c2e; }
.su-input {
  flex: 1; padding: 11px 12px 11px 0;
  background: transparent; border: none; outline: none;
  font-size: 0.86rem; color: #111; font-family: 'Inter', sans-serif;
}
.su-input::placeholder { color: #ccc; }
.su-eye-btn {
  background: none; border: none; cursor: pointer;
  padding: 0 12px; color: #bbb; display: flex;
  align-items: center; transition: color .15s;
}
.su-eye-btn:hover { color: #666; }
.su-role-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
.su-role-btn {
  padding: 9px 6px; border-radius: 10px;
  font-size: 0.74rem; font-weight: 700; cursor: pointer;
  border: 1.5px solid #e5e5e5; background: #f8f8f9;
  color: #666; font-family: 'Inter', sans-serif;
  transition: all .15s; text-align: center;
}
.su-role-btn:hover { border-color: #1a3c2e; color: #1a3c2e; background: rgba(26,60,46,0.04); }
.su-role-btn.active {
  background: linear-gradient(135deg, #1a3c2e, #2d6a4f);
  border-color: #1a3c2e; color: #fff;
  box-shadow: 0 2px 8px rgba(26,60,46,0.25);
}
.su-error {
  background: #fff5f5; border: 1px solid #fecaca;
  border-radius: 10px; padding: 9px 13px;
  font-size: 0.76rem; font-weight: 600; color: #dc2626;
  display: flex; align-items: center; gap: 5px;
}
.su-divider {
  display: flex; align-items: center; gap: 10px;
  font-size: 0.72rem; color: #ccc; font-weight: 600;
}
.su-divider::before, .su-divider::after {
  content: ''; flex: 1; height: 1px; background: #f0f0f0;
}
.su-submit {
  width: 100%; padding: 13px;
  background: linear-gradient(135deg, #1a3c2e, #2d6a4f);
  color: #fff; border: none; border-radius: 13px;
  font-size: 0.88rem; font-weight: 800; cursor: pointer;
  font-family: 'Inter', sans-serif;
  box-shadow: 0 4px 16px rgba(26,60,46,0.3);
  display: flex; align-items: center; justify-content: center; gap: 8px;
  transition: all .15s;
}
.su-submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 6px 22px rgba(26,60,46,0.42); }
.su-submit:disabled { opacity: .65; cursor: not-allowed; }
.su-google {
  width: 100%; padding: 12px;
  background: #fff; border: 1.5px solid #e5e5e5;
  border-radius: 13px; font-size: 0.85rem; font-weight: 600;
  cursor: pointer; color: #333;
  display: flex; align-items: center; justify-content: center; gap: 9px;
  transition: all .15s; font-family: 'Inter', sans-serif;
}
.su-google:hover { background: #f8f8f8; border-color: #d0d0d0; }
.su-google:disabled { opacity: .65; cursor: not-allowed; }
.su-footer {
  text-align: center; font-size: 0.8rem; color: #aaa; cursor: default;
}
.su-footer span { color: #1a3c2e; font-weight: 700; cursor: pointer; transition: opacity .15s; }
.su-footer span:hover { opacity: .7; }
`;

const roleLabels = { user: "🍽 Customer", owner: "🏪 Owner", deliveryBoy: "🛵 Delivery" };

function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("user");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const validate = () => {
    if (!fullName || !email || !password || !mobile) {
      setErr("All fields are required."); return false;
    }
    if (password.length < 6) {
      setErr("Password must be at least 6 characters."); return false;
    }
    if (mobile.length < 10) {
      setErr("Mobile number must be at least 10 digits."); return false;
    }
    return true;
  };

  const handleSignUp = async () => {
    if (!validate()) return;

    setLoading(true);
    setErr("");
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/signup`,
        { fullName, email, password, mobile, role },
        { withCredentials: true }
      );
      dispatch(setUserData(result.data));
      navigate("/"); // redirect after signup
    } catch (error) {
      setErr(error?.response?.data?.message || "Sign up failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    if (!mobile) return setErr("Mobile number is required for Google sign-up.");
    if (mobile.length < 10) return setErr("Mobile number must be at least 10 digits.");

    setLoading(true);
    setErr("");
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const { data } = await axios.post(
        `${serverUrl}/api/auth/google-auth`,
        { fullName: result.user.displayName, email: result.user.email, role, mobile },
        { withCredentials: true }
      );
      dispatch(setUserData(data));
      navigate("/"); // redirect after Google signup
    } catch (error) {
      setErr(error?.response?.data?.message || "Google sign-up failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{css}</style>
      <div className="su-page">
        <div className="su-card">

          {/* Header */}
          <div className="su-header">
            <h1 className="su-logo">meal<span>Hunt</span></h1>
            <p className="su-header-sub">Create your account and start ordering delicious food</p>
          </div>

          <div className="su-body">

            {/* Full Name */}
            <div className="su-field">
              <label className="su-label">Full Name</label>
              <div className="su-input-wrap">
                <span className="su-input-icon"><MdPerson size={17} /></span>
                <input type="text" className="su-input" placeholder="John Doe"
                  onChange={e => setFullName(e.target.value)} value={fullName} />
              </div>
            </div>

            {/* Email */}
            <div className="su-field">
              <label className="su-label">Email Address</label>
              <div className="su-input-wrap">
                <span className="su-input-icon"><MdEmail size={17} /></span>
                <input type="email" className="su-input" placeholder="you@example.com"
                  onChange={e => setEmail(e.target.value)} value={email} />
              </div>
            </div>

            {/* Mobile */}
            <div className="su-field">
              <label className="su-label">Mobile Number</label>
              <div className="su-input-wrap">
                <span className="su-input-icon"><MdPhone size={17} /></span>
                <input type="tel" className="su-input" placeholder="+91 98765 43210"
                  onChange={e => setMobile(e.target.value)} value={mobile} />
              </div>
            </div>

            {/* Password */}
            <div className="su-field">
              <label className="su-label">Password</label>
              <div className="su-input-wrap">
                <span className="su-input-icon"><MdLock size={17} /></span>
                <input
                  type={showPassword ? "text" : "password"}
                  className="su-input"
                  placeholder="Min. 6 characters"
                  onChange={e => setPassword(e.target.value)}
                  value={password}
                />
                <button className="su-eye-btn" type="button" onClick={() => setShowPassword(p => !p)}>
                  {showPassword ? <FaRegEyeSlash size={15} /> : <FaRegEye size={15} />}
                </button>
              </div>
            </div>

            {/* Role */}
            <div className="su-field">
              <label className="su-label">I am a…</label>
              <div className="su-role-grid">
                {["user", "owner", "deliveryBoy"].map(r => (
                  <button
                    key={r}
                    type="button"
                    className={"su-role-btn" + (role === r ? " active" : "")}
                    onClick={() => setRole(r)}
                  >
                    {roleLabels[r]}
                  </button>
                ))}
              </div>
            </div>

            {/* Error */}
            {err && <div className="su-error">⚠ {err}</div>}

            {/* Submit */}
            <button className="su-submit" onClick={handleSignUp} disabled={loading}>
              {loading ? <ClipLoader size={17} color="#fff" /> : "Create Account →"}
            </button>

            <div className="su-divider">or continue with</div>

            {/* Google */}
            <button className="su-google" onClick={handleGoogleAuth} disabled={loading}>
              <FcGoogle size={20} /> Sign up with Google
            </button>

            {/* Footer */}
            <p className="su-footer">
              Already have an account?{" "}
              <span onClick={() => navigate("/signin")}>Sign In</span>
            </p>

          </div>
        </div>
      </div>
    </>
  );
}

export default SignUp;