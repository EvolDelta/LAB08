import fs from "fs";
import path from "path";

export type Book = {
  bookNo: number;
  bookName: string;
};

type DbShape = { books: Book[] };

const dbPath = path.join(process.cwd(), "data", "books.json");

// TODO 1: Implement readDb(): DbShape
// - If file not found: create data folder + books.json with { books: [] }
// - Read file text (utf-8) and JSON.parse
function readDb(): DbShape {
  // ensure data folder and file exist
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (!fs.existsSync(dbPath)) {
    const initial: DbShape = { books: [] };
    fs.writeFileSync(dbPath, JSON.stringify(initial, null, 2), "utf-8");
    return initial;
  }

  const txt = fs.readFileSync(dbPath, "utf-8");
  try {
    const obj = JSON.parse(txt) as DbShape;
    if (!obj || !Array.isArray(obj.books)) return { books: [] };
    return obj;
  } catch (err) {
    // corrupted file: overwrite with empty shape
    const initial: DbShape = { books: [] };
    fs.writeFileSync(dbPath, JSON.stringify(initial, null, 2), "utf-8");
    return initial;
  }
}

// TODO 2: Implement writeDb(db: DbShape)
// - JSON.stringify(db, null, 2) and writeFileSync utf-8
function writeDb(db: DbShape) {
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), "utf-8");
}

export function readBooks(): Book[] {
  return readDb().books;
}

export function addBook(bookName: string): Book {
  const name = (bookName || "").trim();
  if (!name) throw new Error("bookName is required");

  const db = readDb();
  const max = db.books.reduce((acc, b) => Math.max(acc, b.bookNo), 0);
  const newBook: Book = { bookNo: max + 1, bookName: name };
  db.books.push(newBook);
  writeDb(db);
  return newBook;
}

export function deleteBook(bookNo: number): boolean {
  const db = readDb();
  const idx = db.books.findIndex((b) => b.bookNo === bookNo);
  if (idx === -1) return false;
  db.books.splice(idx, 1);
  writeDb(db);
  return true;
}

export function searchBooks(q: string): Book[] {
  const term = (q || "").trim().toLowerCase();
  if (!term) return readDb().books;
  return readDb().books.filter((b) => b.bookName.toLowerCase().includes(term));
}
