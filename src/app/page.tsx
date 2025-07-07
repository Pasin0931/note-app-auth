"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Save, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { error } from "console"
import { title } from "process"
import AuthForm from '@/components/auth-form'

interface Note {
  id: number
  title: string
  content: string
  createAt: string
  updateAt: string
}

interface UserData {
  id: number
  email: string
  name: string
}

export default function NotesApp() {
  const [notes, setNotes] = useState<Note[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editNote, setEditNote] = useState({ title: "", content: "" })
  const [newNote, setNewNote] = useState({ title: "", content: "" })

  const [user, setUser] = useState<UserData | null>(null)
  const [token, setToken] = useState<UserData | null>(null)

  useEffect(() => {
    fetchNotes()
  }, [])

  const handleAuth = (authToken: string, userData: any) => {
    // setToken(authToken)
    setUser(userData)
    setLoading(false)
  }

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
    if (!newNote.title.trim()) return

    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newNote)
      })

      if (response.ok) {
        setNewNote({ title: "", content: "" })
        setIsCreating(false)
        fetchNotes()
      }
    } catch (error) {
      console.error("Error creating note:", error)
    }
  }

  const startEditing = (note: Note) => {
    setEditingId(note.id)
    setEditNote({ title: note.title, content: note.content })
  }

  const cancelEditing = () => {
    setEditingId(null)
    setEditNote({ title: "", content: "" })
  }

  const updateNote = async (id: number) => {
    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editNote)
      })

      if (response.ok) {
        setEditingId(null)
        setEditNote({ title: "", content: "" })
        fetchNotes()
      }
    } catch (error) {
      console.log("Error updating note:", error)
    }
  }

  const deleteNote = async (id: number) => {
    try {
      if (!confirm("Do you want to delete this note ?")) {
        return console.log("Canceled deleting note")
      }
      const response = await fetch(`/api/notes/${id}`, {
        method: "DELETE"
      })

      if (response.ok) {
        fetchNotes()
      }

      alert("Note deleted successfuly")
    } catch (error) {
      console.error("Error deleting note:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">
          Loading notes. . .
        </div>
      </div>
    )
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
            <Plus className="w-4 h-4" />
            New Note
          </Button>
        </div>

        {/* ------------------------------------------------------------------------------------------- */}

        <AuthForm/>
        {isCreating && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Create New Note</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Note Title"
                value={newNote.title}
                onChange={(e) => setNewNote({ ...newNote, title: e.target.value })} />
              <Textarea
                placeholder="Write your note here..."
                value={newNote.content}
                onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                rows={4} />
              <div className="flex-gap-2 space-y-2">

                <Button onClick={createNote} className="flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Save Note
                </Button>

                <Button
                  variant="outline"
                  onClick={() => {
                    setIsCreating(false)
                    setNewNote({ title: "", content: "" })
                  }}
                  className="flex items-center gap-2">
                  Cancel</Button>

              </div>

            </CardContent>
          </Card>
        )}

        {/* ------------------------------------------------------------------------------------------- */}

        {/* Note Grid */}
        {/* <div className="grid gap-4 md: grid-cols lg:grid-cols-3">
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
                {editingId === notes.id ? (

                  <div className="space-y-2">
                    <Textarea
                      value={editNote.content}
                      onChange={(e) => setEditNote({ ...editNote, content: e.target.value })}
                      rows={3} />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => updateNote(notes.id)} className="flex items-center gap-1">
                        <Save className="w-3 h-3" />
                        Save
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => cancelEditing()} className="flex items-center gap-1">
                        <X className="w-3 h-3" />
                        Cancel
                      </Button>
                    </div>
                  </div>

                )

                  :

                  (<div className="space-y-4">
                    <p className="text-gray-700 text-sm leading-relaxed">{notes.content || "No content"}</p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"

                        onClick={() => startEditing(notes)}

                        className="flex items-center gap-1"><Edit className="flex items-center gap-1" />
                        Edit
                      </Button>

                      <Button
                        size="sm"
                        variant="destructive"

                        onClick={() => deleteNote(notes.id)}

                        className="flex items-center gap-1">
                        <Trash2 className="w-3 h-3" />
                        Delete
                      </Button>
                    </div>

                  </div>)}
              </CardContent>

            </Card>
          ))}
        </div>

        {notes.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Plus className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Notes Empty</h3>
            <p className="text-gray-600 mb-4">Get started by creating your first note !</p>
            <Button onClick={() => setIsCreating(true)}>Create your first note</Button>
          </div>
        )} */}

      </div>
    </div>
  )
}