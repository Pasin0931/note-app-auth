import { NextResponse } from "next/server"
import { notesDb } from "@/lib/db"
import { getUserFromRequest } from '@/lib/auth'

// ---> api/notes/search?q="books"
export async function GET(request) {
    try {

        const user = getUserFromRequest(request)
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const query = searchParams.get("q")

        if (!query || query.trim() === "") return NextResponse.json({ error: "Query parameter is required" }, { status: 400 })

        const notes = await notesDb.searchNotes(query.trim(), user.userId)

        return NextResponse.json(notes)

    } catch (error) {
        console.error("Error searching note:", error)
        return NextResponse.json({ error: "Failed to search notes" }, { status: 500 })
    }
}