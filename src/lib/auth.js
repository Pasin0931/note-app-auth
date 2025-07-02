import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

const JWT_SECRET = process.env.JWT_SECRET || "secret"

export function hashPassword(password) {
    return bcrypt.hashSync(password, 12)
}

export function verifyPassword(password, hashPassword) {
    return bcrypt.compareSync(password, hashPassword)
}

export function gennerateToken(payload) {
    return jwt.sign(payload, JWT_SECRET, {expiresIn: "7d"})
}

export function verifyToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET)
    } catch (error) {
        return null
    }
}

export function getUserFromRequest(request) {
    try {
        const authHeader = request.headers.get("authorization")
        if (!authHeader || !authHeader.startsWith("Bearer")) {
            return null
        }
        const token = authHeader.substring(7)
        const decode = verifyToken(token)
        return decode
    } catch (error) {
        return null
    }
}