const books = [];
const RENDER_EVENT = "render-book";
const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "TODO_APPS";

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browsernya nggak ngedukung local storage nih");
    return false;
  }
  return true;
}

function loadDataFromStorage() {
  const serialiazedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serialiazedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});

document.addEventListener(RENDER_EVENT, function () {
  console.log(books);

  const uncompletedBookList = document.getElementById("inBookShelfList");
  uncompletedBookList.innerHTML = "";

  const completedBookList = document.getElementById("compBookShelfList");
  completedBookList.innerHTML = "";

  for (const todoItem of books) {
    const bookEl = makeBook(todoItem);
    if (!todoItem.isComplete) {
      uncompletedBookList.append(bookEl);
    } else {
      completedBookList.append(bookEl);
    }
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("inputBook");
  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

// Add TODO

function addBook() {
  const titleBook = document.getElementById("bookTitle").value;
  const author = document.getElementById("bookAuthor").value;
  const year = document.getElementById("bookYear").value;
  const inputBookIsComplete = document.getElementById("bookIsCompleted").checked;
  const inputBook = document.getElementById("inputBook");

  const generateID = generateId();
  const bookObject = generateBook(generateID, titleBook, author, year, inputBookIsComplete);
  inputBook.reset();
  setTimeout(alert("Berhasil !!!"), 1000);

  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

// GENERATE ID

function generateId() {
  return +new Date();
}

function generateBook(id, titleBook, author, year, isComplete) {
  return {
    id,
    titleBook,
    author,
    year,
    isComplete,
  };
}

// MAKE TODO
function makeBook(bookObject) {
  const textTitle = document.createElement("h2");
  textTitle.innerText = bookObject.titleBook;

  const authorText = document.createElement("p");
  authorText.innerText = bookObject.author;

  const yearText = document.createElement("p");
  yearText.innerText = bookObject.year;

  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("action");

  const container = document.createElement("article");
  container.classList.add("book_item");
  container.setAttribute("id", `book-${bookObject.id}`);
  container.append(textTitle, authorText, yearText, buttonContainer);

  if (bookObject.isComplete) {
    const uncompleteButton = document.createElement("button");
    uncompleteButton.classList.add("green");
    uncompleteButton.innerHTML = "Belum Selesai";

    uncompleteButton.addEventListener("click", function () {
      undoBookFromCompleted(bookObject.id);
    });

    const completeButton = document.createElement("button");
    completeButton.classList.add("red");
    completeButton.innerHTML = "Hapus Buku";

    completeButton.addEventListener("click", function () {
      removeBookFromCompleted(bookObject.id);
    });

    buttonContainer.append(uncompleteButton, completeButton);
  } else {
    const uncompleteButton = document.createElement("button");
    uncompleteButton.classList.add("green");
    uncompleteButton.innerHTML = "Selesai Dibaca";

    uncompleteButton.addEventListener("click", function () {
      addBookToCompleted(bookObject.id);
    });

    const completeButton = document.createElement("button");
    completeButton.classList.add("red");
    completeButton.innerHTML = "Hapus Buku";

    completeButton.addEventListener("click", function () {
      removeBookFromCompleted(bookObject.id);
    });

    buttonContainer.append(uncompleteButton, completeButton);
  }
  return container;
}

// ADD TASK TO COMPLETED
function addBookToCompleted(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isComplete = true;

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

// FIND TODO
function findBook(bookId) {
  for (const book of books) {
    if (book.id == bookId) {
      return book;
    }
  }
  return null;
}

// REMOVE TASK FROM COMPLETED

function removeBookFromCompleted(bookId) {
  const bookTarget = findBookIndex(bookId);
  if (bookTarget == -1) return;

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

// UNDO TASK FROM COMPLETED

function undoBookFromCompleted(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;
  bookTarget.isComplete = false;

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

// FIND TODO INDEX

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
}

// SAVE DATA
function saveData() {
  if (isStorageExist()) {
    const parse = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parse);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}
