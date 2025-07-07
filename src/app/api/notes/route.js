import { NextResponse } from "next/server"
import { notesDb } from "@/lib/db"
import { getUserFromRequest } from '@/lib/auth'

// GET
export async function GET(request) {
    try {
        // const notes = notesDb.getAllNotes()
        // return NextResponse.json(notes)

        const user = getUserFromRequest(request)
        if (!user) {
            return NextResponse.json({error: "Unauthorized"}, {status: 401})
        }
        const notes = notesDb.getAllNotes(user.userId)
        return NextResponse.json(notes)

    } catch (error) {
        console.error("Error fetching notes:", error)
        return NextResponse.json({ error: "Error fetching notes" }, { status: 500 })
    }
}

// POST
export async function POST(request) {
    try {

        const user = getUserFromRequest(request)
        console.log(user)
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { title, content } = await request.json()

        if (!title.trim() || !content.trim() === "") {
            return NextResponse.json({ error: "title and content are required" }, { status: 400 })
        }

        const result = notesDb.createNote(title.trim(), content.trim(), user.userId)

        if (result.changes > 0) {
            const newNote = notesDb.getNoteById(result.lastInsertRowid, user.userId)
            return NextResponse.json(newNote, { status: 201 })
        } else {
            return NextResponse.json({ error: "Failed to create note" }, { status: 500 })
        }

    } catch (error) {

        console.error("Error creating note: ", error)
        return NextResponse.json({ error: "Failed to create note" }, { status: 500 })

    }

}