"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Save, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { error } from "console"

interface Note {
  id: number
  title: string
  content: string
  createAt: string
  updateAt: string
}

export default function NotesApp() {
  const [notes, setNotes] = useState<Note[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [newNote, setNewNote ] = useState({title: "", content: ""})

  useEffect(() => {
    fetchNotes()
  }, [])

  const fetchNotes = async () => {
    try {
      const response = await fetch("/api/notes")
      const data = await response.json()
      setNotes(data)
    } catch (error) {
      console.error("Error fetching notes:", error)
    } finally {
      setLoading(false)
    }
  }

  const createNote = async () => {
    if(!newNote.title.trim()) return

    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(newNote)
      })

      if (response.ok) {
        setNewNote({title: "", content: ""})
        setIsCreating(false)
        fetchNotes()
      }
    } catch (error) {
      console.error("Error creating note:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">

      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
        <div>
        <h1 className="text-3xl font-bold text-gray-900">My Notes</h1>
        <p className="text-gray-600 mt-1">Organized your thoughts and ideas</p>
        </div>
        <Button onClick={() => setIsCreating(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4"/>
          New Note
        </Button>
        </div>


        {/* Note Grid */}
        <div className="grid gap-4 md: grid-cols lg:grid-cols-3">
        {notes.map((notes) => (
          <Card key={notes.id} className="h-fit">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{notes.title}</CardTitle>
              <CardDescription>
                <Badge variant="secondary" className="text-xs">
                  {new Date(notes.createAt).toLocaleDateString()}
                </Badge>
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-700 text-sm leading-relaxed">{notes.content || "No content"}</p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    // onClick={() => startEditing}
                    className="flex items-center gap-1"><Edit className="flex items-center gap-1"/>
                  </Button>

                  <Button
                    size="sm"
                    variant="destructive"
                    //onClick={()=>deleteNote}
                    className="flex items-center gap-1">
                      <Trash2 className="w-3 h-3"/>
                      Delete
                  </Button>
                </div>
              
              </div>
            </CardContent>
          </Card>
        ))}
        </div>

      </div>
    </div>
  )
}