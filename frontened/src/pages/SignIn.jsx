import React, { useState } from 'react'
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from 'react-router-dom';
import axios from "axios"
import { serverUrl } from '../App';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../firebase';
import { ClipLoader } from 'react-spinners';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';
import { MdEmail, MdLock } from 'react-icons/md';

const css = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

.si-page {
  font-family: 'Inter', sans-serif;
  min-height: 100vh; width: 100%;
  display: flex; align-items: center; justify-content: center;
  padding: 24px 16px; background: #f8f8f9;
  position: relative; overflow: hidden;
}
.si-blob1 {
  position: absolute; top: -120px; right: -80px;
  width: 380px; height: 380px; border-radius: 50%;
  background: radial-gradient(circle, rgba(26,60,46,0.07) 0%, transparent 70%);
  pointer-events: none;
}
.si-blob2 {
  position: absolute; bottom: -100px; left: -80px;
  width: 320px; height: 320px; border-radius: 50%;
  background: radial-gradient(circle, rgba(255,200,0,0.05) 0%, transparent 70%);
  pointer-events: none;
}

/* ── Card layout ── */
.si-wrap {
  width: 100%; max-width: 900px;
  display: grid; grid-template-columns: 1fr;
  border-radius: 24px; overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.06), 0 20px 60px rgba(0,0,0,0.1);
  position: relative; z-index: 1;
  animation: cardIn .45s cubic-bezier(.34,1.56,.64,1);
}
@media(min-width:768px){ .si-wrap { grid-template-columns: 1fr 1fr; } }
@keyframes cardIn {
  from { opacity:0; transform:scale(.96) translateY(16px); }
  to   { opacity:1; transform:scale(1) translateY(0); }
}

/* ── Left panel ── */
.si-left {
  display: none;
  background: linear-gradient(145deg, #1a3c2e 0%, #2d6a4f 60%, #1a5c38 100%);
  padding: 44px 36px;
  flex-direction: column; justify-content: space-between;
  position: relative; overflow: hidden;
}
@media(min-width:768px){ .si-left { display: flex; } }
.si-lb1 {
  position: absolute; right:-60px; top:-60px;
  width:220px; height:220px; border-radius:50%;
  background:rgba(255,255,255,0.05); pointer-events:none;
}
.si-lb2 {
  position: absolute; left:-40px; bottom:-40px;
  width:180px; height:180px; border-radius:50%;
  background:rgba(255,200,0,0.06); pointer-events:none;
}
.si-brand {
  display: flex; align-items: center; gap: 10px;
  position: relative; z-index: 1;
}
.si-brand-icon {
  width: 36px; height: 36px; border-radius: 10px;
  background: rgba(255,255,255,0.14);
  border: 1px solid rgba(255,255,255,0.2);
  display: flex; align-items: center; justify-content: center;
  font-size: 0.95rem; color: #ffc800; font-weight: 900;
}
.si-brand-name { font-size: 1.15rem; font-weight: 900; color: #fff; letter-spacing: -0.4px; }

.si-left-mid { position: relative; z-index: 1; }
.si-left-title {
  font-size: 1.65rem; font-weight: 900; color: #fff;
  line-height: 1.15; letter-spacing: -0.5px; margin: 0 0 10px;
}
.si-left-title span { color: #ffc800; display: block; }
.si-left-sub { font-size: 0.8rem; color: rgba(255,255,255,0.55); line-height: 1.65; margin: 0; }

.si-features { position: relative; z-index: 1; display: flex; flex-direction: column; gap: 10px; }
.si-feat {
  display: flex; align-items: center; gap: 10px;
  background: rgba(255,255,255,0.07);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 12px; padding: 10px 13px;
}
.si-feat-icon {
  width: 30px; height: 30px; border-radius: 8px;
  background: rgba(255,255,255,0.1);
  display: flex; align-items: center; justify-content: center;
  font-size: 0.95rem; flex-shrink: 0;
}
.si-feat-name { font-size: 0.76rem; font-weight: 600; color: rgba(255,255,255,0.8); }
.si-feat-sub { font-size: 0.65rem; color: rgba(255,255,255,0.4); margin-top: 1px; }

/* ── Right panel ── */
.si-right {
  background: #fff; padding: 40px 32px;
  display: flex; flex-direction: column; justify-content: center;
}
.si-right-title {
  font-size: 1.45rem; font-weight: 900; color: #111;
  letter-spacing: -0.5px; margin: 0 0 6px;
}
.si-right-sub { font-size: 0.8rem; color: #aaa; margin: 0 0 26px; }

/* ── Form ── */
.si-form { display: flex; flex-direction: column; gap: 15px; }
.si-field { display: flex; flex-direction: column; gap: 5px; }
.si-label {
  font-size: 0.7rem; font-weight: 700; color: #666;
  text-transform: uppercase; letter-spacing: 0.5px;
}
.si-iw {
  display: flex; align-items: center;
  background: #f8f8f9; border: 1.5px solid #ececec;
  border-radius: 12px; overflow: hidden;
  transition: border-color .2s, box-shadow .2s, background .2s;
}
.si-iw:focus-within {
  border-color: #1a3c2e;
  box-shadow: 0 0 0 3px rgba(26,60,46,0.08);
  background: #fff;
}
.si-iicon {
  padding: 0 11px; color: #ccc; flex-shrink: 0;
  display: flex; align-items: center; transition: color .2s;
}
.si-iw:focus-within .si-iicon { color: #1a3c2e; }
.si-inp {
  flex: 1; padding: 11px 10px 11px 0;
  background: transparent; border: none; outline: none;
  font-size: 0.86rem; color: #111; font-family: 'Inter', sans-serif;
}
.si-inp::placeholder { color: #ccc; }
.si-eyebtn {
  padding: 0 12px; background: none; border: none;
  cursor: pointer; color: #bbb;
  display: flex; align-items: center; transition: color .15s;
}
.si-eyebtn:hover { color: #555; }

.si-forgot {
  text-align: right; font-size: 0.74rem; font-weight: 700;
  color: #1a3c2e; cursor: pointer; transition: opacity .15s;
  margin-top: -4px;
}
.si-forgot:hover { opacity: .7; }

.si-error {
  background: #fff5f5; border: 1px solid #fecaca;
  border-radius: 10px; padding: 9px 13px;
  font-size: 0.74rem; font-weight: 600; color: #dc2626;
  display: flex; align-items: center; gap: 5px;
}

.si-submit {
  width: 100%; padding: 13px;
  background: linear-gradient(135deg, #1a3c2e, #2d6a4f);
  color: #fff; border: none; border-radius: 12px;
  font-size: 0.86rem; font-weight: 800; cursor: pointer;
  font-family: 'Inter', sans-serif;
  box-shadow: 0 4px 14px rgba(26,60,46,0.3);
  display: flex; align-items: center; justify-content: center;
  transition: all .15s; margin-top: 2px;
}
.si-submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(26,60,46,0.42); }
.si-submit:disabled { opacity: .65; cursor: not-allowed; }

.si-or {
  display: flex; align-items: center; gap: 10px;
  font-size: 0.7rem; font-weight: 600; color: #ccc;
}
.si-or::before,.si-or::after { content:''; flex:1; height:1px; background:#efefef; }

.si-google {
  width: 100%; padding: 11px;
  background: #fff; border: 1.5px solid #e5e5e5;
  border-radius: 12px; font-size: 0.84rem; font-weight: 600;
  color: #333; cursor: pointer;
  display: flex; align-items: center; justify-content: center; gap: 9px;
  transition: all .15s; font-family: 'Inter', sans-serif;
}
.si-google:hover { background: #f8f8f8; border-color: #d0d0d0; }

.si-footer {
  text-align: center; font-size: 0.76rem; color: #aaa; margin-top: 2px;
}
.si-footer span { color: #1a3c2e; font-weight: 700; cursor: pointer; }
.si-footer span:hover { text-decoration: underline; }
`;

function SignIn() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [err, setErr] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleSignIn = async () => {
    setLoading(true)
    try {
      const result = await axios.post(`${serverUrl}/api/auth/signin`, { email, password }, { withCredentials: true })
      dispatch(setUserData(result.data))
      setErr(""); setLoading(false)
    } catch (error) {
      setErr(error?.response?.data?.message); setLoading(false)
    }
  }

  const handleGoogleAuth = async () => {
    const provider = new GoogleAuthProvider()
    const result = await signInWithPopup(auth, provider)
    try {
      const { data } = await axios.post(`${serverUrl}/api/auth/google-auth`, { email: result.user.email }, { withCredentials: true })
      dispatch(setUserData(data))
    } catch (error) { console.log(error) }
  }

  return (
    <>
      <style>{css}</style>
      <div className="si-page">
        <div className="si-blob1" /><div className="si-blob2" />
        <div className="si-wrap">

          {/* Left */}
          <div className="si-left">
            <div className="si-lb1" /><div className="si-lb2" />
            <div className="si-brand">
              <div className="si-brand-icon">V</div>
              <span className="si-brand-name">vingo</span>
            </div>
            <div className="si-left-mid">
              <h2 className="si-left-title">Food delivered<span>at your door.</span></h2>
              <p className="si-left-sub">Order from the best restaurants near you. Fast, fresh, always on time.</p>
            </div>
            <div className="si-features">
              <div className="si-feat">
                <div className="si-feat-icon">🍔</div>
                <div><p className="si-feat-name">100+ Restaurants</p><p className="si-feat-sub">New options added daily</p></div>
              </div>
              <div className="si-feat">
                <div className="si-feat-icon">⚡</div>
                <div><p className="si-feat-name">30 min delivery</p><p className="si-feat-sub">Hot food, right on time</p></div>
              </div>
              <div className="si-feat">
                <div className="si-feat-icon">🔒</div>
                <div><p className="si-feat-name">Secure payments</p><p className="si-feat-sub">UPI, cards & cash</p></div>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="si-right">
            <h1 className="si-right-title">Welcome back 👋</h1>
            <p className="si-right-sub">Sign in to continue ordering delicious food</p>

            <div className="si-form">
              <div className="si-field">
                <label className="si-label">Email Address</label>
                <div className="si-iw">
                  <span className="si-iicon"><MdEmail size={16} /></span>
                  <input type="email" className="si-inp" placeholder="you@example.com"
                    onChange={e => setEmail(e.target.value)} value={email} />
                </div>
              </div>

              <div className="si-field">
                <label className="si-label">Password</label>
                <div className="si-iw">
                  <span className="si-iicon"><MdLock size={16} /></span>
                  <input type={showPassword ? "text" : "password"} className="si-inp"
                    placeholder="Enter your password"
                    onChange={e => setPassword(e.target.value)} value={password} />
                  <button className="si-eyebtn" type="button" onClick={() => setShowPassword(p => !p)}>
                    {showPassword ? <FaRegEyeSlash size={14} /> : <FaRegEye size={14} />}
                  </button>
                </div>
              </div>

              <div className="si-forgot" onClick={() => navigate("/forgot-password")}>
                Forgot password?
              </div>

              {err && <div className="si-error">⚠ {err}</div>}

              <button className="si-submit" onClick={handleSignIn} disabled={loading}>
                {loading ? <ClipLoader size={16} color="#fff" /> : "Sign In →"}
              </button>

              <div className="si-or">or continue with</div>

              <button className="si-google" onClick={handleGoogleAuth}>
                <FcGoogle size={18} /> Sign in with Google
              </button>

              <p className="si-footer">
                Don't have an account?{' '}
                <span onClick={() => navigate("/signup")}>Create one</span>
              </p>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}

export default SignIn
