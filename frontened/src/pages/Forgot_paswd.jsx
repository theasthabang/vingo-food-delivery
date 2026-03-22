import axios from 'axios';
import React, { useState } from 'react'
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { serverUrl } from '../App';
import { ClipLoader } from 'react-spinners';
import { MdLockReset, MdEmail, MdLock } from 'react-icons/md';
import { RiShieldKeyholeLine } from 'react-icons/ri';

const css = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

.fp-page {
  font-family: 'Inter', sans-serif;
  min-height: 100vh; background: #f8f8f9;
  display: flex; align-items: center; justify-content: center;
  padding: 24px 16px; position: relative;
}

/* ── Back ── */
.fp-back {
  position: fixed; top: 16px; left: 16px; z-index: 100;
  width: 38px; height: 38px; border-radius: 12px;
  background: rgba(255,255,255,0.9); backdrop-filter: blur(12px);
  border: 1px solid rgba(0,0,0,0.08);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; color: #555;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08); transition: all .15s;
}
.fp-back:hover { background: #fff; color: #111; transform: translateX(-2px); }

/* ── Card ── */
.fp-card {
  width: 100%; max-width: 440px; background: #fff;
  border-radius: 24px; border: 1px solid rgba(0,0,0,0.06);
  box-shadow: 0 4px 12px rgba(0,0,0,0.05), 0 20px 60px rgba(0,0,0,0.08);
  overflow: hidden;
}

/* ── Header ── */
.fp-header {
  padding: 32px 32px 24px;
  background: linear-gradient(135deg, #1a3c2e 0%, #2d6a4f 100%);
  display: flex; flex-direction: column; align-items: center;
  gap: 12px; text-align: center; position: relative; overflow: hidden;
}
.fp-header::before {
  content: ''; position: absolute; right: -40px; top: -40px;
  width: 160px; height: 160px; border-radius: 50%;
  background: rgba(255,200,0,0.08);
}
.fp-header::after {
  content: ''; position: absolute; left: -20px; bottom: -30px;
  width: 120px; height: 120px; border-radius: 50%;
  background: rgba(255,255,255,0.04);
}
.fp-header-icon {
  width: 56px; height: 56px; border-radius: 16px;
  background: rgba(255,255,255,0.12);
  border: 1px solid rgba(255,255,255,0.18);
  display: flex; align-items: center; justify-content: center;
  position: relative; z-index: 1;
}
.fp-header-title {
  font-size: 1.3rem; font-weight: 800; color: #fff;
  letter-spacing: -0.4px; margin: 0; position: relative; z-index: 1;
}
.fp-header-sub {
  font-size: 0.76rem; color: rgba(255,255,255,0.55);
  margin: 0; position: relative; z-index: 1; line-height: 1.5;
}

/* ── Step progress ── */
.fp-steps {
  display: flex; align-items: center; justify-content: center;
  gap: 6px; position: relative; z-index: 1;
}
.fp-step-dot {
  width: 28px; height: 4px; border-radius: 4px;
  background: rgba(255,255,255,0.2); transition: background .3s;
}
.fp-step-dot.done { background: #ffc800; }
.fp-step-dot.active { background: rgba(255,255,255,0.7); }

/* ── Body ── */
.fp-body { padding: 28px 32px 32px; display: flex; flex-direction: column; gap: 18px; }

/* ── Field ── */
.fp-field { display: flex; flex-direction: column; gap: 6px; }
.fp-label {
  font-size: 0.72rem; font-weight: 700; color: #666;
  text-transform: uppercase; letter-spacing: 0.5px;
}

.fp-input-wrap {
  display: flex; align-items: center;
  background: #f8f8f9; border: 1.5px solid #ececec;
  border-radius: 12px; overflow: hidden;
  transition: border-color .2s, box-shadow .2s, background .2s;
}
.fp-input-wrap:focus-within {
  border-color: #1a3c2e;
  box-shadow: 0 0 0 3px rgba(26,60,46,0.08);
  background: #fff;
}
.fp-input-icon {
  padding: 0 12px; color: #ccc; flex-shrink: 0;
  display: flex; align-items: center;
}
.fp-input-wrap:focus-within .fp-input-icon { color: #1a3c2e; }
.fp-input {
  flex: 1; padding: 11px 12px 11px 0;
  background: transparent; border: none; outline: none;
  font-size: 0.88rem; color: #111;
  font-family: 'Inter', sans-serif;
}
.fp-input::placeholder { color: #ccc; }

/* ── OTP input special ── */
.fp-otp-input {
  flex: 1; padding: 11px 12px 11px 0;
  background: transparent; border: none; outline: none;
  font-size: 1.4rem; color: #111; letter-spacing: 10px;
  font-weight: 800; font-family: 'Inter', sans-serif;
  text-align: center;
}
.fp-otp-input::placeholder { letter-spacing: 4px; font-size: 0.88rem; font-weight: 400; color: #ccc; }

/* ── Info box ── */
.fp-info {
  background: rgba(26,60,46,0.05);
  border: 1px solid rgba(26,60,46,0.1);
  border-radius: 10px; padding: 10px 14px;
  font-size: 0.76rem; color: #1a3c2e; font-weight: 500;
  display: flex; align-items: center; gap: 7px;
}

/* ── Error ── */
.fp-error {
  background: #fff5f5; border: 1px solid #fecaca;
  border-radius: 10px; padding: 9px 13px;
  font-size: 0.76rem; font-weight: 600; color: #dc2626;
  display: flex; align-items: center; gap: 5px;
}

/* ── Password match indicator ── */
.fp-match {
  font-size: 0.72rem; font-weight: 600;
  display: flex; align-items: center; gap: 4px;
  margin-top: 2px;
}
.fp-match.ok { color: #16a34a; }
.fp-match.no { color: #dc2626; }

/* ── Submit ── */
.fp-submit {
  width: 100%; padding: 13px;
  background: linear-gradient(135deg, #1a3c2e, #2d6a4f);
  color: #fff; border: none; border-radius: 13px;
  font-size: 0.88rem; font-weight: 800; cursor: pointer;
  font-family: 'Inter', sans-serif; letter-spacing: -0.1px;
  box-shadow: 0 4px 16px rgba(26,60,46,0.3);
  display: flex; align-items: center; justify-content: center; gap: 8px;
  transition: all .15s; margin-top: 2px;
}
.fp-submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 6px 22px rgba(26,60,46,0.42); }
.fp-submit:disabled { opacity: .65; cursor: not-allowed; }

/* ── Back to login link ── */
.fp-signin-link {
  text-align: center; font-size: 0.78rem; color: #aaa;
}
.fp-signin-link span {
  color: #1a3c2e; font-weight: 700; cursor: pointer;
  transition: opacity .15s;
}
.fp-signin-link span:hover { opacity: .7; }
`;

const stepMeta = [
  { title: "Forgot Password", sub: "Enter your email to receive a one-time password" },
  { title: "Verify OTP", sub: "Enter the 6-digit code sent to your email" },
  { title: "Reset Password", sub: "Create a new strong password for your account" },
]

function ForgotPassword() {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [err, setErr] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSendOtp = async () => {
    setLoading(true)
    try {
      const result = await axios.post(`${serverUrl}/api/auth/send-otp`, { email }, { withCredentials: true })
      console.log(result)
      setErr(""); setStep(2); setLoading(false)
    } catch (error) {
      setErr(error.response.data.message); setLoading(false)
    }
  }

  const handleVerifyOtp = async () => {
    setLoading(true)
    try {
      const result = await axios.post(`${serverUrl}/api/auth/verify-otp`, { email, otp }, { withCredentials: true })
      console.log(result)
      setErr(""); setStep(3); setLoading(false)
    } catch (error) {
      setErr(error?.response?.data?.message); setLoading(false)
    }
  }

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) return
    setLoading(true)
    try {
      const result = await axios.post(`${serverUrl}/api/auth/reset-password`, { email, newPassword }, { withCredentials: true })
      setErr(""); console.log(result); setLoading(false)
      navigate("/signin")
    } catch (error) {
      setErr(error?.response?.data?.message); setLoading(false)
    }
  }

  const meta = stepMeta[step - 1]
  const passwordsMatch = confirmPassword.length > 0 && newPassword === confirmPassword
  const passwordsMismatch = confirmPassword.length > 0 && newPassword !== confirmPassword

  return (
    <>
      <style>{css}</style>
      <div className="fp-page">

        <div className="fp-back" onClick={() => navigate("/signin")}>
          <IoIosArrowRoundBack size={20} />
        </div>

        <div className="fp-card">

          {/* Header */}
          <div className="fp-header">
            <div className="fp-header-icon">
              {step === 1 && <MdEmail style={{ color: '#ffc800', fontSize: '1.4rem' }} />}
              {step === 2 && <RiShieldKeyholeLine style={{ color: '#ffc800', fontSize: '1.4rem' }} />}
              {step === 3 && <MdLock style={{ color: '#ffc800', fontSize: '1.4rem' }} />}
            </div>
            <h1 className="fp-header-title">{meta.title}</h1>
            <p className="fp-header-sub">{meta.sub}</p>
            <div className="fp-steps">
              <div className={"fp-step-dot" + (step > 1 ? " done" : step === 1 ? " active" : "")} />
              <div className={"fp-step-dot" + (step > 2 ? " done" : step === 2 ? " active" : "")} />
              <div className={"fp-step-dot" + (step === 3 ? " active" : "")} />
            </div>
          </div>

          <div className="fp-body">

            {/* ── Step 1: Email ── */}
            {step === 1 && (
              <>
                <div className="fp-field">
                  <label className="fp-label">Email Address</label>
                  <div className="fp-input-wrap">
                    <span className="fp-input-icon"><MdEmail size={17} /></span>
                    <input
                      type="email" className="fp-input"
                      placeholder="you@example.com"
                      onChange={e => setEmail(e.target.value)} value={email}
                    />
                  </div>
                </div>
                {err && <div className="fp-error">⚠ {err}</div>}
                <button className="fp-submit" onClick={handleSendOtp} disabled={loading}>
                  {loading ? <ClipLoader size={17} color="#fff" /> : "Send OTP →"}
                </button>
                <p className="fp-signin-link">
                  Remember your password? <span onClick={() => navigate("/signin")}>Sign In</span>
                </p>
              </>
            )}

            {/* ── Step 2: OTP ── */}
            {step === 2 && (
              <>
                <div className="fp-info">
                  📧 OTP sent to <strong style={{ marginLeft: 4 }}>{email}</strong>
                </div>
                <div className="fp-field">
                  <label className="fp-label">One-Time Password</label>
                  <div className="fp-input-wrap" style={{ justifyContent: 'center' }}>
                    <input
                      type="text" className="fp-otp-input"
                      placeholder="· · · · · ·"
                      maxLength={6}
                      onChange={e => setOtp(e.target.value)} value={otp}
                    />
                  </div>
                </div>
                {err && <div className="fp-error">⚠ {err}</div>}
                <button className="fp-submit" onClick={handleVerifyOtp} disabled={loading}>
                  {loading ? <ClipLoader size={17} color="#fff" /> : "Verify OTP →"}
                </button>
                <p className="fp-signin-link">
                  Wrong email? <span onClick={() => setStep(1)}>Go back</span>
                </p>
              </>
            )}

            {/* ── Step 3: New password ── */}
            {step === 3 && (
              <>
                <div className="fp-field">
                  <label className="fp-label">New Password</label>
                  <div className="fp-input-wrap">
                    <span className="fp-input-icon"><MdLock size={17} /></span>
                    <input
                      type="password" className="fp-input"
                      placeholder="Enter new password"
                      onChange={e => setNewPassword(e.target.value)} value={newPassword}
                    />
                  </div>
                </div>
                <div className="fp-field">
                  <label className="fp-label">Confirm Password</label>
                  <div className="fp-input-wrap">
                    <span className="fp-input-icon"><MdLockReset size={17} /></span>
                    <input
                      type="password" className="fp-input"
                      placeholder="Confirm new password"
                      onChange={e => setConfirmPassword(e.target.value)} value={confirmPassword}
                    />
                  </div>
                  {passwordsMatch && <p className="fp-match ok">✓ Passwords match</p>}
                  {passwordsMismatch && <p className="fp-match no">✗ Passwords do not match</p>}
                </div>
                {err && <div className="fp-error">⚠ {err}</div>}
                <button
                  className="fp-submit"
                  onClick={handleResetPassword}
                  disabled={loading || passwordsMismatch}
                >
                  {loading ? <ClipLoader size={17} color="#fff" /> : "Reset Password →"}
                </button>
              </>
            )}

          </div>
        </div>
      </div>
    </>
  )
}

export default ForgotPassword