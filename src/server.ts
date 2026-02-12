import express, { Request, Response } from "express";
import path from "path";
import {
  addBook,
  readBooks,
  deleteBook,
  searchBooks,
} from "./services/bookFileDb";

const app = express();
const PORT = process.env.PORT || 3000;

// middleware for HTML form parsing, JSON and static files
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(process.cwd(), "public")));

app.get("/", (req: Request, res: Response) => {
  return res.sendFile(path.join(process.cwd(), "public", "index.html"));
});

app.get("/books", (req: Request, res: Response) => {
  const books = readBooks();
  return res.json(books);
});

app.get("/books/search", (req: Request, res: Response) => {
  const q = typeof req.query.q === "string" ? req.query.q : "";
  const books = searchBooks(q);
  return res.json(books);
});

app.delete("/books/:bookNo", (req: Request, res: Response) => {
  const no = Number(req.params.bookNo);
  if (Number.isNaN(no)) return res.status(400).send("Invalid bookNo");
  const ok = deleteBook(no);
  if (!ok) return res.status(404).send("Not found");
  return res.sendStatus(200);
});

app.post("/books/delete", (req: Request, res: Response) => {
  const body = req.body || {};
  const no = Number(body.bookNo);
  if (!no || Number.isNaN(no))
    return res.status(400).send("bookNo is required");
  deleteBook(no);
  return res.redirect("/");
});

app.post("/books/add", (req: Request, res: Response) => {
  try {
    const body = req.body || {};
    const rawName = typeof body.bookName === "string" ? body.bookName : "";
    const bookName = rawName.trim();
    if (!bookName) {
      return res.status(400).send("bookName is required");
    }

    addBook(bookName);

    return res.redirect("/");
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server error");
  }
});

app.listen(PORT, () => {
  console.log(`Server running: http://localhost:${PORT}`);
});
