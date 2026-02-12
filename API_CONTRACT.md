# Books API Contract

Base URL: `/`

Endpoints:

- `GET /books`
  - Description: Returns all books.
  - Response: 200 OK, JSON array of book objects
  - Book shape: { bookNo: number, bookName: string }

- `POST /books/add`
  - Description: Adds a new book from HTML form or JSON body.
  - Request (form or JSON): { bookName: string }
  - Responses:
    - 302 Redirect to `/` on success
    - 400 Bad Request if `bookName` missing or empty
    - 500 Server error on failure

- `GET /books/search?q=...`
  - Description: Returns books whose `bookName` contains `q` (case-insensitive)
  - Response: 200 OK, JSON array of matching book objects

- `DELETE /books/:bookNo`
  - Description: Deletes the book with `bookNo`.
  - Response: 200 OK on success, 404 if not found

- `POST /books/delete`
  - Description: Form-friendly delete endpoint that removes a book and redirects to `/`.
  - Request (form): { bookNo: number }
  - Response: 302 Redirect to `/` on success

Notes:
- Static site served from `/` (serves `public/index.html` and assets).
- Data persisted in `data/books.json` with shape `{ books: Book[] }`
