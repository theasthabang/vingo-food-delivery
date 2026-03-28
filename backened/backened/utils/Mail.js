import nodemailer from "nodemailer"

const createTransporter = () => {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",  // ← use host instead of service
    port: 587,               // ← change 465 to 587
    secure: false,           // ← change true to false
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS,
    },
  })
}

export const sendOtpMail = async (to, otp) => {
  try {
    const transporter = createTransporter()  // ← creates AFTER dotenv loads
    await transporter.sendMail({
      from: process.env.EMAIL,
      to,
      subject: "Reset Your Password",
      html: `<p>Your OTP for password reset is <b>${otp}</b>. It expires in 5 minutes.</p>`
    })
    console.log(`✅ OTP mail sent to ${to}`)
  } catch (error) {
    console.error("❌ sendOtpMail failed:", error.message)
    throw error
  }
}

export const sendDeliveryOtpMail = async (user, otp) => {
  try {
    const transporter = createTransporter()  // ← creates AFTER dotenv loads
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: user.email,
      subject: "Delivery OTP",
      html: `<p>Your OTP for delivery is <b>${otp}</b>. It expires in 5 minutes.</p>`
    })
    console.log(`✅ Delivery OTP mail sent to ${user.email}`)
  } catch (error) {
    console.error("❌ sendDeliveryOtpMail failed:", error.message)
    throw error
  }
}