import { NextResponse } from "next/server"
import { userDb } from "@/lib/db"

export async function POST(request) {
    try {

        const { email, password, name } = await request.json()

        // Validation
        if (!email || !password || !name) {
            return NextResponse.json({error: "All fields are required"})
        }
        if (password.length < 6) {
            return NextResponse.json({error: "Password must be at least 6 characters"}, { status: 400 })
        }
        
        return NextResponse.json({message: "User initialized successful"})

    } catch (error) {
        console.error("Registration failed:", error)
        return NextResponse.json({error: "Internal server error"}, {error: 404})
    }
}