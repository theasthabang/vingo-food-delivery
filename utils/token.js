import jwt from "jsonwebtoken"

const genToken = (userId) => {
  if (!userId) throw new Error("userId is required to generate token")
  
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: "4d" }
  )
}

export default genToken