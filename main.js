// Memuat bookshelf dari localStorage saat halaman dimuat
let bookshelf = loadFromLocalStorage() || { read: [], unread: [] };

// Fungsi untuk menyimpan data bookshelf ke localStorage
function saveToLocalStorage() {
  localStorage.setItem('bookshelf', JSON.stringify(bookshelf));
}

// Fungsi untuk memuat bookshelf dari localStorage
function loadFromLocalStorage() {
  const data = localStorage.getItem('bookshelf');
  return data ? JSON.parse(data) : null;
}

// Fungsi untuk menambahkan buku
function addBook(title, author, year, isComplete) {
  const newBook = {
    id: +new Date(),
    title,
    author,
    year: Number(year), 
    isComplete 
  };

  // Tambahkan ke rak yang sesuai
  if (isComplete) {
    bookshelf.read.push(newBook);
  } else {
    bookshelf.unread.push(newBook);
  }
  
  saveToLocalStorage();
  renderBookshelf();
}

// Fungsi untuk menghapus buku
function deleteBook(bookId, isComplete) {
  const targetShelf = isComplete ? 'read' : 'unread';
  bookshelf[targetShelf] = bookshelf[targetShelf].filter(book => book.id !== bookId);
  saveToLocalStorage();
  renderBookshelf();
}

// Fungsi untuk memindahkan buku antar rak
function toggleBookCompletion(bookId) {
  let book, sourceShelf, targetShelf;

  if (bookshelf.read.some(b => b.id === bookId)) {
    sourceShelf = 'read';
    targetShelf = 'unread';
  } else {
    sourceShelf = 'unread';
    targetShelf = 'read';
  }

  book = bookshelf[sourceShelf].find(b => b.id === bookId);
  bookshelf[sourceShelf] = bookshelf[sourceShelf].filter(b => b.id !== bookId);

  book.isComplete = !book.isComplete; 
  bookshelf[targetShelf].push(book);
  
  saveToLocalStorage();
  renderBookshelf();
}

// Fungsi untuk menampilkan daftar buku
function renderBookshelf(searchTitle = '') {
  const incompleteBookList = document.getElementById('incompleteBookList');
  const completeBookList = document.getElementById('completeBookList');
  
  incompleteBookList.innerHTML = '';
  completeBookList.innerHTML = '';

  // Menyaring dan menampilkan buku yang sesuai dengan pencarian
  bookshelf.unread
    .filter(book => book.title.toLowerCase().includes(searchTitle))
    .forEach(book => incompleteBookList.appendChild(createBookElement(book)));

  bookshelf.read
    .filter(book => book.title.toLowerCase().includes(searchTitle))
    .forEach(book => completeBookList.appendChild(createBookElement(book)));
}

// Fungsi untuk membuat elemen buku
function createBookElement(book) {
  const bookElement = document.createElement('div');
  bookElement.setAttribute('data-bookid', book.id);
  bookElement.setAttribute('data-testid', 'bookItem');

  bookElement.innerHTML = 
    `<h3 data-testid="bookItemTitle">${book.title}</h3>
    <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
    <p data-testid="bookItemYear">Tahun: ${book.year}</p>
    <div>
      <button data-testid="bookItemIsCompleteButton">${book.isComplete ? 'Belum selesai dibaca' : 'Selesai dibaca'}</button>
      <button data-testid="bookItemDeleteButton">Hapus Buku</button>
    </div>`;

  bookElement.querySelector('[data-testid="bookItemIsCompleteButton"]').addEventListener('click', () => toggleBookCompletion(book.id));
  bookElement.querySelector('[data-testid="bookItemDeleteButton"]').addEventListener('click', () => deleteBook(book.id, book.isComplete));
  
  return bookElement;
}

// Fungsi untuk menangani pengiriman form tambah buku
document.getElementById('bookForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const title = document.getElementById('bookFormTitle').value;
  const author = document.getElementById('bookFormAuthor').value;
  const year = document.getElementById('bookFormYear').value;
  const isComplete = document.getElementById('bookFormIsComplete').checked;

  addBook(title, author, year, isComplete);
  this.reset(); 
});

// Fungsi untuk mencari buku
document.getElementById('searchBook').addEventListener('submit', function(event) {
  event.preventDefault();

  const searchTitle = document.getElementById('searchBookTitle').value.toLowerCase();
  renderBookshelf(searchTitle);
});

// Render bookshelf awal saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
  renderBookshelf(); // Render bookshelf setelah halaman dimuat dan data tersedia
});
