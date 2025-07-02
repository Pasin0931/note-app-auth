import { NextResponse } from "next/server";
import { userDb } from "../../../../lib/db";
import { gennerateToken, verifyPassword } from "../../../../lib/auth";

export async function POST(request) {
    try {
        const { email, password } = await request.json()

        // Validation
        if (!email || !password) {
            return NextResponse.json( { error: "Email and password are required" }, { status: 404 } )
        }

        // Find user
        const user = userDb.getUserByEmail(email)
        if (!user) {
            return NextResponse.json( {error: "Invalid email"}, {status: 400} )
        }
        const isValidPassword = verifyPassword(password, user.password)
        // Verify password
        if (!isValidPassword) {
            return NextResponse.json( {error: "Invalid Password"}, {status: 400} )
        }

        // Gennerate token
        const token = gennerateToken({
            userId: user.id,
            email: user.email,
            name: user.name
        })

        return NextResponse.json({
            message: "Login successful",
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            },
            token
        })
    } catch (error) {
        console.error("Login error:", error)
        return NextResponse.json( {error: "Internal server error"}, {status: 500} )
    }
}