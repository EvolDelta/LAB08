async function loadBooks() {
  await loadBooksWithQuery();
}

async function loadBooksWithQuery(q) {
  try {
    const url = q ? `/books/search?q=${encodeURIComponent(q)}` : "/books";
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to load books");
    const books = await res.json();
    const container = document.getElementById("book-list");
    if (!container) return;
    container.innerHTML = "";
    if (!Array.isArray(books) || books.length === 0) {
      container.textContent = "No books found.";
      return;
    }
    const ul = document.createElement("ul");
    books.forEach((b) => {
      const li = document.createElement("li");
      li.textContent = `${b.bookNo}: ${b.bookName}`;
      const del = document.createElement("button");
      del.textContent = "Delete";
      del.style.marginLeft = "8px";
      del.addEventListener("click", async () => {
        await deleteBook(b.bookNo);
        await loadBooksWithQuery(document.getElementById("search-q").value);
      });
      li.appendChild(del);
      ul.appendChild(li);
    });
    container.appendChild(ul);
  } catch (err) {
    const container = document.getElementById("book-list");
    if (container) container.textContent = "Error loading books.";
    console.error(err);
  }
}

async function deleteBook(bookNo) {
  try {
    // use POST form-friendly delete
    const form = new URLSearchParams();
    form.append("bookNo", String(bookNo));
    const res = await fetch("/books/delete", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form.toString(),
    });
    if (!res.ok && res.status !== 302) throw new Error("Delete failed");
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

window.addEventListener("DOMContentLoaded", () => {
  loadBooks();
  const searchForm = document.getElementById("search-form");
  if (searchForm) {
    searchForm.addEventListener("submit", (ev) => {
      ev.preventDefault();
      const q = document.getElementById("search-q").value;
      loadBooksWithQuery(q);
    });
  }
  const clear = document.getElementById("clear-search");
  if (clear) {
    clear.addEventListener("click", () => {
      document.getElementById("search-q").value = "";
      loadBooksWithQuery();
    });
  }
});

window.addEventListener("DOMContentLoaded", loadBooks);
