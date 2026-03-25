import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../App";
import { ClipLoader } from "react-spinners";

// ✅ FIX 1: Create axios instance with withCredentials so cookies work cross-origin
const api = axios.create({
  baseURL: serverUrl,
  withCredentials: true,
});

function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  // ✅ FIX 2: Changed to 4-digit OTP array (backend generates 4-digit OTP with Math.floor(1000 + Math.random() * 9000))
  const [otpArray, setOtpArray] = useState(["", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const otp = otpArray.join("");

  // OTP INPUT HANDLER
  const handleOtpChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otpArray];
    newOtp[index] = value;
    setOtpArray(newOtp);

    // ✅ FIX 3: Changed index < 5 to index < 3 to match 4-digit OTP
    if (value && index < 3) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otpArray[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  // STEP 1: SEND OTP
  const handleSendOtp = async () => {
    if (!email) return setErr("Please enter your email");
    setLoading(true);
    setErr("");
    try {
      await api.post(`/api/auth/send-otp`, { email });
      setStep(2);
    } catch (error) {
      setErr(error?.response?.data?.message || "Failed to send OTP");
    }
    setLoading(false);
  };

  // STEP 2: VERIFY OTP
  const handleVerifyOtp = async () => {
    // ✅ FIX 4: Validate that all 4 OTP digits are filled before submitting
    if (otp.length < 4) return setErr("Please enter the complete 4-digit OTP");
    setLoading(true);
    setErr("");
    try {
      await api.post(`/api/auth/verify-otp`, { email, otp });
      setStep(3);
    } catch (error) {
      setErr(error?.response?.data?.message || "Invalid OTP");
    }
    setLoading(false);
  };

  // STEP 3: RESET PASSWORD
  const handleResetPassword = async () => {
    if (newPassword.length < 6) return setErr("Password must be at least 6 characters");
    if (newPassword !== confirmPassword) return setErr("Passwords do not match");

    setLoading(true);
    setErr("");
    try {
      await api.post(`/api/auth/reset-password`, { email, newPassword });
      setSuccess(true);
      setTimeout(() => navigate("/signin"), 2500);
    } catch (error) {
      setErr(error?.response?.data?.message || "Reset failed");
    }
    setLoading(false);
  };

  // SUCCESS SCREEN
  if (success) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.successIcon}>✓</div>
          <h2>Password Reset Successful!</h2>
          <p>Redirecting to login...</p>
          <ClipLoader size={30} />
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Forgot Password</h2>

        {/* STEP 1 */}
        {step === 1 && (
          <>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErr(""); }}
              style={styles.input}
            />
            {err && <p style={styles.error}>{err}</p>}
            <button onClick={handleSendOtp} style={styles.btn} disabled={loading}>
              {loading ? <ClipLoader size={15} color="#fff" /> : "Send OTP"}
            </button>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <p>Enter OTP sent to {email}</p>
            <div style={styles.otpContainer}>
              {/* ✅ Now renders 4 boxes to match 4-digit OTP from backend */}
              {otpArray.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  value={digit}
                  maxLength={1}
                  onChange={(e) => handleOtpChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  style={styles.otpInput}
                />
              ))}
            </div>
            {err && <p style={styles.error}>{err}</p>}
            <button onClick={handleVerifyOtp} style={styles.btn} disabled={loading}>
              {loading ? <ClipLoader size={15} color="#fff" /> : "Verify OTP"}
            </button>
            {/* ✅ FIX 5: Added resend OTP option */}
            <p
              style={{ fontSize: "13px", marginTop: "10px", cursor: "pointer", color: "#555" }}
              onClick={() => { setStep(1); setOtpArray(["", "", "", ""]); setErr(""); }}
            >
              Resend OTP
            </p>
          </>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <>
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => { setNewPassword(e.target.value); setErr(""); }}
              style={styles.input}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => { setConfirmPassword(e.target.value); setErr(""); }}
              style={styles.input}
            />
            {err && <p style={styles.error}>{err}</p>}
            <button onClick={handleResetPassword} style={styles.btn} disabled={loading}>
              {loading ? <ClipLoader size={15} color="#fff" /> : "Reset Password"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f5f5f5",
  },
  card: {
    padding: "30px",
    borderRadius: "10px",
    background: "#fff",
    width: "300px",
    textAlign: "center",
    boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    boxSizing: "border-box",
    border: "1px solid #ddd",
    borderRadius: "6px",
    fontSize: "14px",
  },
  btn: {
    width: "100%",
    padding: "10px",
    background: "black",
    color: "white",
    border: "none",
    cursor: "pointer",
    borderRadius: "6px",
    fontSize: "14px",
    marginTop: "8px",
  },
  error: {
    color: "red",
    fontSize: "13px",
    margin: "4px 0",
  },
  otpContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    margin: "15px 0",
  },
  otpInput: {
    width: "48px",
    height: "52px",
    textAlign: "center",
    fontSize: "20px",
    border: "1.5px solid #ddd",
    borderRadius: "8px",
  },
  successIcon: {
    fontSize: "50px",
    color: "green",
  },
};