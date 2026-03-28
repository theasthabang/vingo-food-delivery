import axios from "axios";
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../App";
import { ClipLoader } from "react-spinners";
import { MdEmail, MdLock, MdCheckCircle } from "react-icons/md";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

const api = axios.create({
  baseURL: serverUrl,
  withCredentials: true,
});

const css = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

.fp-page {
  font-family: 'Inter', sans-serif;
  min-height: 100vh; width: 100%;
  background: #f8f8f9;
  display: flex; align-items: center; justify-content: center;
  padding: 24px 16px;
  position: relative; overflow: hidden;
}

/* Background blobs */
.fp-blob1 {
  position: absolute; top: -100px; right: -80px;
  width: 350px; height: 350px; border-radius: 50%;
  background: radial-gradient(circle, rgba(26,60,46,0.07) 0%, transparent 70%);
  pointer-events: none;
}
.fp-blob2 {
  position: absolute; bottom: -80px; left: -60px;
  width: 300px; height: 300px; border-radius: 50%;
  background: radial-gradient(circle, rgba(255,200,0,0.06) 0%, transparent 70%);
  pointer-events: none;
}

/* Card */
.fp-card {
  width: 100%; max-width: 440px;
  background: #fff; border-radius: 24px;
  border: 1px solid rgba(0,0,0,0.06);
  box-shadow: 0 4px 12px rgba(0,0,0,0.05), 0 20px 60px rgba(0,0,0,0.09);
  overflow: hidden;
  position: relative; z-index: 1;
  animation: cardIn .45s cubic-bezier(.34,1.56,.64,1);
}
@keyframes cardIn {
  from { opacity:0; transform:scale(.96) translateY(18px); }
  to   { opacity:1; transform:scale(1) translateY(0); }
}

/* Header */
.fp-header {
  padding: 26px 30px 20px;
  background: linear-gradient(135deg, #1a3c2e 0%, #2d6a4f 100%);
  position: relative; overflow: hidden;
}
.fp-header::before {
  content:''; position:absolute; right:-40px; top:-40px;
  width:160px; height:160px; border-radius:50%;
  background:rgba(255,200,0,0.09); pointer-events:none;
}
.fp-header::after {
  content:''; position:absolute; left:-20px; bottom:-30px;
  width:110px; height:110px; border-radius:50%;
  background:rgba(255,255,255,0.04); pointer-events:none;
}
.fp-logo {
  font-size: 1.35rem; font-weight: 900; color: #fff;
  letter-spacing: -0.5px; margin: 0 0 14px;
  position: relative; z-index:1;
}
.fp-logo span { color: #ffc800; }

/* Step indicator */
.fp-steps {
  display: flex; align-items: center; gap: 0;
  position: relative; z-index: 1;
}
.fp-step-item {
  display: flex; align-items: center; gap: 6px;
}
.fp-step-dot {
  width: 26px; height: 26px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.68rem; font-weight: 800;
  transition: all .3s;
}
.fp-step-dot.done {
  background: #ffc800; color: #1a3c2e;
}
.fp-step-dot.active {
  background: #fff; color: #1a3c2e;
  box-shadow: 0 0 0 3px rgba(255,255,255,0.25);
}
.fp-step-dot.pending {
  background: rgba(255,255,255,0.15); color: rgba(255,255,255,0.5);
}
.fp-step-label {
  font-size: 0.65rem; font-weight: 600;
  transition: color .3s;
}
.fp-step-label.active { color: #fff; }
.fp-step-label.done { color: #ffc800; }
.fp-step-label.pending { color: rgba(255,255,255,0.4); }
.fp-step-line {
  width: 28px; height: 1.5px; margin: 0 4px;
  background: rgba(255,255,255,0.2);
  flex-shrink: 0;
}
.fp-step-line.done { background: #ffc800; }

/* Body */
.fp-body {
  padding: 26px 30px 30px;
  display: flex; flex-direction: column; gap: 16px;
}

.fp-step-title {
  font-size: 1.15rem; font-weight: 900; color: #111;
  letter-spacing: -0.4px; margin: 0 0 2px;
}
.fp-step-sub {
  font-size: 0.78rem; color: #aaa; margin: 0;
  line-height: 1.5;
}
.fp-step-sub strong { color: #1a3c2e; font-weight: 700; }

/* Field */
.fp-field { display: flex; flex-direction: column; gap: 5px; }
.fp-label {
  font-size: 0.7rem; font-weight: 700; color: #666;
  text-transform: uppercase; letter-spacing: 0.5px;
}
.fp-iw {
  display: flex; align-items: center;
  background: #f8f8f9; border: 1.5px solid #ececec;
  border-radius: 12px; overflow: hidden;
  transition: border-color .2s, box-shadow .2s, background .2s;
}
.fp-iw:focus-within {
  border-color: #1a3c2e;
  box-shadow: 0 0 0 3px rgba(26,60,46,0.08);
  background: #fff;
}
.fp-iicon {
  padding: 0 11px; color: #ccc; flex-shrink: 0;
  display: flex; align-items: center; transition: color .2s;
}
.fp-iw:focus-within .fp-iicon { color: #1a3c2e; }
.fp-inp {
  flex: 1; padding: 11px 10px 11px 0;
  background: transparent; border: none; outline: none;
  font-size: 0.86rem; color: #111; font-family: 'Inter', sans-serif;
}
.fp-inp::placeholder { color: #ccc; }
.fp-eyebtn {
  padding: 0 12px; background: none; border: none;
  cursor: pointer; color: #bbb;
  display: flex; align-items: center; transition: color .15s;
}
.fp-eyebtn:hover { color: #555; }

/* OTP boxes */
.fp-otp-row {
  display: flex; justify-content: center; gap: 10px;
}
.fp-otp-box {
  width: 56px; height: 60px;
  text-align: center; font-size: 1.4rem; font-weight: 800;
  border: 1.5px solid #e0e0e0; border-radius: 14px;
  background: #f8f8f9; color: #111;
  outline: none; font-family: 'Inter', sans-serif;
  transition: border-color .2s, box-shadow .2s, background .2s, transform .1s;
  caret-color: #1a3c2e;
}
.fp-otp-box:focus {
  border-color: #1a3c2e;
  box-shadow: 0 0 0 3px rgba(26,60,46,0.1);
  background: #fff;
  transform: scale(1.05);
}
.fp-otp-box.filled {
  border-color: #2d6a4f;
  background: rgba(26,60,46,0.04);
  color: #1a3c2e;
}

/* Error */
.fp-error {
  background: #fff5f5; border: 1px solid #fecaca;
  border-radius: 10px; padding: 9px 13px;
  font-size: 0.74rem; font-weight: 600; color: #dc2626;
  display: flex; align-items: center; gap: 6px;
  animation: errShake .3s ease;
}
@keyframes errShake {
  0%,100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

/* Submit button */
.fp-btn {
  width: 100%; padding: 13px;
  background: linear-gradient(135deg, #1a3c2e, #2d6a4f);
  color: #fff; border: none; border-radius: 12px;
  font-size: 0.88rem; font-weight: 800; cursor: pointer;
  font-family: 'Inter', sans-serif;
  box-shadow: 0 4px 14px rgba(26,60,46,0.3);
  display: flex; align-items: center; justify-content: center; gap: 8px;
  transition: all .15s;
}
.fp-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(26,60,46,0.42); }
.fp-btn:disabled { opacity: .6; cursor: not-allowed; }

/* Resend row */
.fp-resend-row {
  display: flex; align-items: center; justify-content: center; gap: 5px;
  font-size: 0.76rem; color: #aaa;
}
.fp-resend-btn {
  background: none; border: none; cursor: pointer;
  font-size: 0.76rem; font-weight: 700;
  color: #1a3c2e; font-family: 'Inter', sans-serif;
  padding: 0; transition: opacity .15s;
}
.fp-resend-btn:hover { opacity: .7; }
.fp-resend-btn:disabled { opacity: .4; cursor: not-allowed; }

/* Back link */
.fp-back {
  text-align: center; font-size: 0.76rem; color: #aaa;
}
.fp-back span {
  color: #1a3c2e; font-weight: 700; cursor: pointer;
}
.fp-back span:hover { text-decoration: underline; }

/* Success screen */
.fp-success {
  padding: 48px 30px;
  display: flex; flex-direction: column;
  align-items: center; gap: 14px; text-align: center;
}
.fp-success-ring {
  width: 72px; height: 72px; border-radius: 50%;
  background: linear-gradient(135deg, #1a3c2e, #2d6a4f);
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 8px 24px rgba(26,60,46,0.35);
  animation: popIn .5s cubic-bezier(.34,1.56,.64,1);
}
@keyframes popIn {
  from { transform: scale(0); opacity: 0; }
  to   { transform: scale(1); opacity: 1; }
}
.fp-success-title {
  font-size: 1.2rem; font-weight: 900; color: #111;
  letter-spacing: -0.4px; margin: 0;
}
.fp-success-sub { font-size: 0.8rem; color: #aaa; margin: 0; line-height: 1.6; }
.fp-success-bar {
  width: 100%; height: 4px; background: #f0f0f0;
  border-radius: 4px; overflow: hidden; margin-top: 8px;
}
.fp-success-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #1a3c2e, #2d6a4f);
  border-radius: 4px;
  animation: barFill 2.5s linear forwards;
}
@keyframes barFill {
  from { width: 0%; }
  to   { width: 100%; }
}

/* Password strength */
.fp-strength {
  display: flex; gap: 4px; margin-top: 4px;
}
.fp-strength-bar {
  flex: 1; height: 3px; border-radius: 3px;
  background: #ececec; transition: background .3s;
}
.fp-strength-bar.weak   { background: #ef4444; }
.fp-strength-bar.medium { background: #f59e0b; }
.fp-strength-bar.strong { background: #22c55e; }
.fp-strength-label {
  font-size: 0.68rem; font-weight: 600; margin-top: 3px;
  color: #aaa;
}
.fp-strength-label.weak   { color: #ef4444; }
.fp-strength-label.medium { color: #f59e0b; }
.fp-strength-label.strong { color: #22c55e; }
`;

const getStrength = (pw) => {
  if (!pw) return { level: 0, label: "", key: "" };
  if (pw.length < 6) return { level: 1, label: "Too short", key: "weak" };
  const hasUpper = /[A-Z]/.test(pw);
  const hasNum = /[0-9]/.test(pw);
  const hasSpecial = /[^A-Za-z0-9]/.test(pw);
  const score = (hasUpper ? 1 : 0) + (hasNum ? 1 : 0) + (hasSpecial ? 1 : 0);
  if (score <= 1) return { level: 2, label: "Weak", key: "weak" };
  if (score === 2) return { level: 3, label: "Medium", key: "medium" };
  return { level: 4, label: "Strong", key: "strong" };
};

function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otpArray, setOtpArray] = useState(["", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const navigate = useNavigate();
  const otpRefs = useRef([]);
  const otp = otpArray.join("");
  const strength = getStrength(newPassword);

  // Cooldown timer for resend
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  // OTP handlers
  const handleOtpChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;
    const next = [...otpArray];
    next[index] = value;
    setOtpArray(next);
    if (value && index < 3) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otpArray[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4).split("");
    if (pasted.length === 4) {
      setOtpArray(pasted);
      otpRefs.current[3]?.focus();
    }
  };

  // API handlers
  const handleSendOtp = async () => {
    if (!email) return setErr("Please enter your email address.");
    setLoading(true); setErr("");
    try {
      await api.post("/api/auth/send-otp", { email });
      setStep(2);
      setResendCooldown(30);
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch (error) {
      setErr(error?.response?.data?.message || "Failed to send OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setOtpArray(["", "", "", ""]); setErr("");
    setLoading(true);
    try {
      await api.post("/api/auth/send-otp", { email });
      setResendCooldown(30);
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch (error) {
      setErr(error?.response?.data?.message || "Failed to resend OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length < 4) return setErr("Please enter all 4 OTP digits.");
    setLoading(true); setErr("");
    try {
      await api.post("/api/auth/verify-otp", { email, otp });
      setStep(3);
    } catch (error) {
      setErr(error?.response?.data?.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (newPassword.length < 6) return setErr("Password must be at least 6 characters.");
    if (newPassword !== confirmPassword) return setErr("Passwords do not match.");
    setLoading(true); setErr("");
    try {
      await api.post("/api/auth/reset-password", { email, newPassword });
      setSuccess(true);
      setTimeout(() => navigate("/signin"), 2500);
    } catch (error) {
      setErr(error?.response?.data?.message || "Reset failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const stepMeta = [
    { label: "Email" },
    { label: "OTP" },
    { label: "Reset" },
  ];

  const getStepClass = (i) => {
    const idx = i + 1;
    if (idx < step) return "done";
    if (idx === step) return "active";
    return "pending";
  };

  // Success screen
  if (success) {
    return (
      <>
        <style>{css}</style>
        <div className="fp-page">
          <div className="fp-blob1" /><div className="fp-blob2" />
          <div className="fp-card">
            <div className="fp-header">
              <p className="fp-logo">meal<span>Hunt</span></p>
            </div>
            <div className="fp-success">
              <div className="fp-success-ring">
                <MdCheckCircle size={36} color="#fff" />
              </div>
              <h2 className="fp-success-title">Password Reset!</h2>
              <p className="fp-success-sub">
                Your password has been updated successfully.<br />
                Redirecting you to sign in…
              </p>
              <div className="fp-success-bar">
                <div className="fp-success-bar-fill" />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{css}</style>
      <div className="fp-page">
        <div className="fp-blob1" /><div className="fp-blob2" />
        <div className="fp-card">

          {/* Header */}
          <div className="fp-header">
            <p className="fp-logo">meal<span>Hunt</span></p>
            <div className="fp-steps">
              {stepMeta.map((s, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <div className={`fp-step-line ${i < step ? "done" : ""}`} />}
                  <div className="fp-step-item">
                    <div className={`fp-step-dot ${getStepClass(i)}`}>
                      {i + 1 < step ? "✓" : i + 1}
                    </div>
                    <span className={`fp-step-label ${getStepClass(i)}`}>{s.label}</span>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="fp-body">

            {/* STEP 1 — Email */}
            {step === 1 && (
              <>
                <div>
                  <h2 className="fp-step-title">Forgot your password?</h2>
                  <p className="fp-step-sub">Enter your registered email and we'll send you an OTP.</p>
                </div>
                <div className="fp-field">
                  <label className="fp-label">Email Address</label>
                  <div className="fp-iw">
                    <span className="fp-iicon"><MdEmail size={16} /></span>
                    <input
                      type="email"
                      className="fp-inp"
                      placeholder="you@example.com"
                      value={email}
                      onChange={e => { setEmail(e.target.value); setErr(""); }}
                      onKeyDown={e => e.key === "Enter" && handleSendOtp()}
                    />
                  </div>
                </div>
                {err && <div className="fp-error">⚠ {err}</div>}
                <button className="fp-btn" onClick={handleSendOtp} disabled={loading}>
                  {loading ? <ClipLoader size={16} color="#fff" /> : "Send OTP →"}
                </button>
                <p className="fp-back">
                  Remember it? <span onClick={() => navigate("/signin")}>Sign In</span>
                </p>
              </>
            )}

            {/* STEP 2 — OTP */}
            {step === 2 && (
              <>
                <div>
                  <h2 className="fp-step-title">Check your inbox</h2>
                  <p className="fp-step-sub">
                    We sent a 4-digit OTP to <strong>{email}</strong>
                  </p>
                </div>
                <div className="fp-field">
                  <label className="fp-label">Enter OTP</label>
                  <div className="fp-otp-row">
                    {otpArray.map((digit, i) => (
                      <input
                        key={i}
                        id={`otp-${i}`}
                        ref={el => otpRefs.current[i] = el}
                        className={`fp-otp-box${digit ? " filled" : ""}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        autoFocus={i === 0}
                        onChange={e => handleOtpChange(e.target.value, i)}
                        onKeyDown={e => handleOtpKeyDown(e, i)}
                        onPaste={i === 0 ? handlePaste : undefined}
                      />
                    ))}
                  </div>
                </div>
                {err && <div className="fp-error">⚠ {err}</div>}
                <button className="fp-btn" onClick={handleVerifyOtp} disabled={loading}>
                  {loading ? <ClipLoader size={16} color="#fff" /> : "Verify OTP →"}
                </button>
                <div className="fp-resend-row">
                  <span>Didn't receive it?</span>
                  <button
                    className="fp-resend-btn"
                    onClick={handleResendOtp}
                    disabled={loading || resendCooldown > 0}
                  >
                    {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend OTP"}
                  </button>
                </div>
              </>
            )}

            {/* STEP 3 — New Password */}
            {step === 3 && (
              <>
                <div>
                  <h2 className="fp-step-title">Create new password</h2>
                  <p className="fp-step-sub">Choose something strong that you'll remember.</p>
                </div>
                <div className="fp-field">
                  <label className="fp-label">New Password</label>
                  <div className="fp-iw">
                    <span className="fp-iicon"><MdLock size={16} /></span>
                    <input
                      type={showNew ? "text" : "password"}
                      className="fp-inp"
                      placeholder="Min. 6 characters"
                      value={newPassword}
                      onChange={e => { setNewPassword(e.target.value); setErr(""); }}
                    />
                    <button className="fp-eyebtn" type="button" onClick={() => setShowNew(p => !p)}>
                      {showNew ? <FaRegEyeSlash size={14} /> : <FaRegEye size={14} />}
                    </button>
                  </div>
                  {newPassword && (
                    <>
                      <div className="fp-strength">
                        {[1,2,3,4].map(n => (
                          <div
                            key={n}
                            className={`fp-strength-bar ${n <= strength.level ? strength.key : ""}`}
                          />
                        ))}
                      </div>
                      <span className={`fp-strength-label ${strength.key}`}>{strength.label}</span>
                    </>
                  )}
                </div>
                <div className="fp-field">
                  <label className="fp-label">Confirm Password</label>
                  <div className="fp-iw">
                    <span className="fp-iicon"><MdLock size={16} /></span>
                    <input
                      type={showConfirm ? "text" : "password"}
                      className="fp-inp"
                      placeholder="Re-enter your password"
                      value={confirmPassword}
                      onChange={e => { setConfirmPassword(e.target.value); setErr(""); }}
                      onKeyDown={e => e.key === "Enter" && handleResetPassword()}
                    />
                    <button className="fp-eyebtn" type="button" onClick={() => setShowConfirm(p => !p)}>
                      {showConfirm ? <FaRegEyeSlash size={14} /> : <FaRegEye size={14} />}
                    </button>
                  </div>
                </div>
                {err && <div className="fp-error">⚠ {err}</div>}
                <button className="fp-btn" onClick={handleResetPassword} disabled={loading}>
                  {loading ? <ClipLoader size={16} color="#fff" /> : "Reset Password →"}
                </button>
              </>
            )}

          </div>
        </div>
      </div>
    </>
  );
}

export default ForgotPassword;