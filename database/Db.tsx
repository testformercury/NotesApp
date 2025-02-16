import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseAsync("notesapp.db");

export const initializeDatabase = async () => {
    const database = await db;
    await database.execAsync(
        `CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT, 
      title TEXT, 
      notes TEXT,
      synced INTEGER DEFAULT 0,
      deleted INTEGER DEFAULT 0
    );`
    );
};

export const insertNote = async (title: string, notes: string) => {
    const database = await db;
    await database.runAsync(
        "INSERT INTO items (title, notes, synced, deleted) VALUES (?, ?, 0, 0);",
        [title, notes]
    );
};

export const getAllNotes = async () => {
    const database = await db;
    return await database.getAllAsync("SELECT * FROM items WHERE deleted = 0;");
};

export const getNoteById = async (id: number) => {
    const database = await db;
    return await database.getFirstAsync(
        "SELECT title, notes FROM items WHERE id = ?;",
        [id]
    );
};

export const updateNote = async (id: number, title: string, notes: string) => {
    const database = await db;
    await database.runAsync(
        "UPDATE items SET title = ?, notes = ?, synced = 0, deleted = 0 WHERE id = ?;",
        [title, notes, id]
    );
};

export const deleteNote = async (id: number) => {
    const database = await db;
    await database.runAsync("UPDATE items SET deleted = 1, synced = 0 WHERE id = ?;", [id]);
};

export const getUnsyncedNotes = async (): Promise<any[]> => {
    const database = await db;
    return await database.getAllAsync("SELECT * FROM items WHERE synced = 0;");
};

export const syncNotes = async (id: number) => {
    const database = await db;
    await database.runAsync(
       "UPDATE items SET synced = 1 WHERE id = ?;",
       [id],
    );
};