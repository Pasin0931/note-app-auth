import Database from 'better-sqlite3'
import path from 'path'

let db = null

export function getDataBase() {
    if (!db) {
        const dbPath = path.join(process.cwd(), "note.db")

        db = new Database(dbPath)
        db.pragma("journal_mode = WAL")

        // Note table
        db.exec(`
            CREATE TABLE IF NOT EXISTS notes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                content TEXT,
                user_id INTEGER NOT NULL,
                createAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                updateAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        `)

        // User table
        db.exec(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT NOT NULL,
                password TEXT NOT NULL,
                name TEXT NOT NULL,
                createAt DATETIME DEFAULT CURRENT_TIMESTAMP
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
    createNote(title, content = "", userId) {
        console.log(userId)
        const db = getDataBase()
        const stmt = db.prepare(`INSERT INTO notes (title, content, user_id, createAt, updateAt)
            VALUES(?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`)
        return stmt.run(title, content, userId)
    },

    // Update a note ---------------------------------------- U
    updateNote(id, title, content, userId) {
        const db = getDataBase()
        const stmt = db.prepare(`
            UPDATE notes 
            SET title = ?, content = ?, updateAt = CURRENT_TIMESTAMP 
            WHERE id = ? AND user_id = ?
            `)
        return stmt.run(title, content, id, userId)
    },

    // Read a note ------------------------------------------- R

    // Get all notes
    getAllNotes(userId) {
        const db = getDataBase()
        return db.prepare("SELECT * FROM notes WHERE user_id = ? ORDER BY updateAt DESC").all(userId)
    },

    // Get by Id
    getNoteById(id, userId) {
        const db = getDataBase()
        return db.prepare("SELECT * FROM notes WHERE id = ? AND user_id = ?").get(id, userId)
    },

    searchNotes(query, userId) {
        const db = getDataBase()
        return db.prepare(`
            SELECT * FROM notes
            WHERE (title LIKE ? OR content LIKE ?) AND user_id=?
            ORDER BY updateAt DESC`).all(`%${query}`, `%${query}`, userId)
    },

    // Delete a note ------------------------------------------ D
    deleteNote(id, userId) {
        const db = getDataBase()
        const stmt = db.prepare("DELETE FROM notes WHERE id=? AND user_id = ?")
        return stmt.run(id, userId)
    },

}

// User Database -----------------------------------------------------------

export const userDb = {
    // Create a user ---------------------------------------------- C
    createUser(email, hashedPassword, name) {
        const db = getDataBase()
        const stmt = db.prepare(`
            INSERT INTO users (email, password, name, createAt)
            VALUES (?, ?, ?, CURRENT_TIMESTAMP)
            `)
        return stmt.run(email, hashedPassword, name)
    },

    // Read database---------------------------------------------- R
    getUserByEmail(email) {
        const db = getDataBase()
        return db.prepare("SELECT * FROM users WHERE email = ?").get(email)
    },

    getUserById(id) {
        const db = getDataBase()
        return db.prepare(`SELECT * FROM users WHERE id = ?`).get(id)
    }
}