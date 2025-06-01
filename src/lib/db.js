import Database from 'better-sqlite3'
import path from 'path'

let db = null

export function getDataBase() {
    if (!db) {
        const dbPath = path.join(process.cwd(), "note.db")

        db = new Database(dbPath)
        db.pragma("journal_mode = WAL")
        db.exec(`
            CREATE TABLE IF NOT EXISTS notes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                content TEXT,
                createAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                updateAt DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `)
        console.log("Data base initialized successful")
    }

    return db
}

export function closeDataBase() {
    if (db) {
        db.close()
        db = null
    }
}

export const notesDb = {

    // Create a new Note ----------------------------------- C
    createNote(title, content = "") {
        const db = getDataBase()
        const stmt = db.prepare(`INSERT INTO notes (title, content, createAt, updateAt)
            VALUES(?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`)

        return stmt.run(title, content)
    },

    // Update a note ---------------------------------------- U
    updateNote(id, title, content){
        const db = getDataBase()
        const stmt = db.prepare(`
            UPDATE notes 
            SET title = ?, content = ?, updateAt = CURRENT_TIMESTAMP 
            WHERE id = ?
            `)
        return stmt.run(title, content, id)
    },

    // Read a note ------------------------------------------- R

    // Get all notes
    getAllNotes() {
        const db = getDataBase()
        return db.prepare("SELECT * FROM notes ORDER BY updateAt DESC").all()
    },

    // Get by Id
    getNoteById(id) {
        const db = getDataBase()
        return db.prepare("SELECT * FROM notes WHERE id = ?").get(id)
    },

    searchNote(query) {
        const db = getDataBase()
        return db.prepare(`
            SELECT * FROM notes
            WHERE title LIKE ? OR content LIKE ?
            ORDER BY updateAt DESC`).all(`%${query}`, `%${query}`)
    },

    // Delete a note ------------------------------------------ D
    deleteNote(id) {
        const db = getDataBase()
        const stmt = db.prepare("DELETE FROM notes WHERE id=?")
        return stmt.run(id)
    },

}