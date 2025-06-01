import { NextResponse } from "next/server";
import { notesDb } from "@/lib/db"

export async function GET(request, {params}) {
    try {

        const { id } = params
        const note = await notesDb.getNoteById(id)
        
        if(!note) {
            return NextResponse.json({ error: "Note not found" }, {status: 404})
        }

        return NextResponse.json(note)

    } catch(error) {

        console.error(error)
        return NextResponse.json({error: "Failed to fech note"}, {status: 500})

    }
}

export async function PUT(request, { params }) {
    try {
        const { id } = params
        const { title, content } = await request.json()

        if (!title || title.trim() == "") {
            return NextResponse.json({ error: "Title is required" }, { staus: 400 })
        }

        const result = await notesDb.updateNote(Number.parseInt(id), title.trim(), content || "")

        if (result.changes > 0) {
            const updatedNote = notesDb.getNoteById(Number.parseInt(id))
            return NextResponse.json(updatedNote)
        } else {
            return NextResponse.json({ error: "Note not Found" }, { status: 404 })
        }
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: "Failed to update note" }, { status: 500 })
    }
}

export async function DELETE(request, {params}) {
    try {

        const { id } = params
        const result = await notesDb.deleteNote(Number .parseInt(id))

        if (result.changes > 0) {
            return NextResponse.json({message: "Note Deleted"})
        } else {
            return NextResponse.json({error: "Note not found"}, {status: 404})
        }

    } catch (error) {
        return NextResponse.json({error: "Failed to update note"}, {status: 500})
    }
}

