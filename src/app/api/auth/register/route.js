import { NextResponse } from "next/server"
import { userDb } from "@/lib/db"
import { hashPassword, gennerateToken } from "@/lib/auth"

export async function POST(request) {
    try {

        const { email, password, name } = await request.json()

        // Validation
        if (!email || !password || !name) {
            return NextResponse.json({ error: "All fields are required" })
        }
        if (password.length < 6) {
            return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
        }

        const existingUser = await userDb.getUserByEmail(email)
        if (existingUser) {
            return NextResponse.json({ error: "Email already used" }, { status: 409 })
        }

        const hashedPassword = hashPassword(password)
        const res = await userDb.createUser(email, hashedPassword, name)

        if (res.changes > 0) {
            // Gennerate JWT token
            const token = gennerateToken({
                userId: res.lastInsertRowid,
                email: email,
                name
            })
            return NextResponse.json({ email: email, name: name, message: "User created successfuly", token }, { status: 200 })
        } else {

        }


    } catch (error) {
        console.error("Registration failed:", error)
        return NextResponse.json({ error: "Internal server error" }, { error: 404 })
    }
}