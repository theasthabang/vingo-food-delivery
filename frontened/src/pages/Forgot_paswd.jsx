import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../App";
import { ClipLoader } from "react-spinners";

function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otpArray, setOtpArray] = useState(["", "", "", "", "", ""]);
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

    if (value && index < 5) {
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
    setLoading(true);
    try {
      await axios.post(`${serverUrl}/api/auth/send-otp`, { email });
      setErr("");
      setStep(2);
    } catch (error) {
      setErr(error?.response?.data?.message || "Failed to send OTP");
    }
    setLoading(false);
  };

  // STEP 2: VERIFY OTP
  const handleVerifyOtp = async () => {
    setLoading(true);
    try {
      await axios.post(`${serverUrl}/api/auth/verify-otp`, {
        email,
        otp,
      });
      setErr("");
      setStep(3);
    } catch (error) {
      setErr(error?.response?.data?.message || "Invalid OTP");
    }
    setLoading(false);
  };

  // STEP 3: RESET PASSWORD
  const handleResetPassword = async () => {
    if (newPassword.length < 6) {
      return setErr("Password must be at least 6 characters");
    }

    if (newPassword !== confirmPassword) {
      return setErr("Passwords do not match");
    }

    setLoading(true);
    try {
      await axios.post(`${serverUrl}/api/auth/reset-password`, {
        email,
        newPassword,
      });

      setSuccess(true);

      setTimeout(() => {
        navigate("/signin");
      }, 2500);
    } catch (error) {
      setErr(error?.response?.data?.message || "Reset failed");
    }
    setLoading(false);
  };

  // ✅ SUCCESS SCREEN
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
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
            />

            {err && <p style={styles.error}>{err}</p>}

            <button onClick={handleSendOtp} style={styles.btn}>
              {loading ? <ClipLoader size={15} /> : "Send OTP"}
            </button>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <p>Enter OTP sent to {email}</p>

            <div style={styles.otpContainer}>
              {otpArray.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  value={digit}
                  maxLength={1}
                  onChange={(e) =>
                    handleOtpChange(e.target.value, index)
                  }
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  style={styles.otpInput}
                />
              ))}
            </div>

            {err && <p style={styles.error}>{err}</p>}

            <button onClick={handleVerifyOtp} style={styles.btn}>
              {loading ? <ClipLoader size={15} /> : "Verify OTP"}
            </button>
          </>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <>
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={styles.input}
            />

            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={styles.input}
            />

            {err && <p style={styles.error}>{err}</p>}

            <button onClick={handleResetPassword} style={styles.btn}>
              {loading ? <ClipLoader size={15} /> : "Reset Password"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;


// 🎨 SIMPLE STYLES
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
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
  },
  btn: {
    width: "100%",
    padding: "10px",
    background: "black",
    color: "white",
    border: "none",
    cursor: "pointer",
  },
  error: {
    color: "red",
    fontSize: "14px",
  },
  otpContainer: {
    display: "flex",
    justifyContent: "space-between",
    margin: "15px 0",
  },
  otpInput: {
    width: "40px",
    height: "45px",
    textAlign: "center",
    fontSize: "18px",
  },
  successIcon: {
    fontSize: "50px",
    color: "green",
  },
};