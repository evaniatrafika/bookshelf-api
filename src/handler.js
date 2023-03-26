const { nanoid } = require('nanoid');
const books = require('./books');

// menambahkan buku baru
const addBook = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  // validasi error
  if (name === undefined || name === '') {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  } if (pageCount < readPage) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });

    response.code(400);
    return response;
  }

  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    finished,
    insertedAt,
    updatedAt,
  };

  books.push(newBook);
  const isSuccess = books.filter((book) => book.id === id).length > 0;
  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);

    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);

  return response;
};
const getAllBook = (request, h) => {
  const { name, reading, finished } = request.query;
  let filteredBooks = books;
  if (name !== undefined) {
    filteredBooks = filteredBooks.filter((book) => book
      .name.toLowerCase().includes(name.toLowerCase()));
  }
  if (reading !== undefined) {
    filteredBooks = filteredBooks.filter((book) => book.reading === !!Number(reading));
  }
  if (finished !== undefined) {
    filteredBooks = filteredBooks.filter((book) => book.finished === !!Number(finished));
  }
  const response = h.response({
    status: 'success',
    data: {
      books: filteredBooks.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    },
  });
  response.code(200);
  return response;
};

// menampilkan buku sesuai ID
const getBookById = (request, h) => {
  const { id } = request.params;
  const book = books.filter((nId) => nId.id === id)[0];
  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

// memperbarui buku
const updateBook = (request, h) => {
  const { bookId } = request.params;

  // eslint-disable-next-line no-unused-vars
  const updatedAt = new Date().toISOString();
  const index = books.findIndex((book) => book.id === bookId);
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  // check id
  let checkId = true;
  for (const value of books) {
    if (value.id === bookId) {
      checkId = false;
    }
  }
  if (checkId) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });

    response.code(404);
    return response;
  }

  // check name
  let Namecheck = false;
  if ((name === undefined) || (name === '') || !name) {
    Namecheck = true;
  }

  if (Namecheck) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });

    response.code(400);
    return response;
  }

  // check readPage
  let checkReadPage = false;
  if (readPage > pageCount) {
    checkReadPage = true;
  }

  if (checkReadPage) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });

    response.code(400);
    return response;
  }

  const response = h.response({
    status: 'success',
    message: 'Buku berhasil diperbarui',
  });

  books[index] = {
    ...books[index],
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  };

  response.code(200);
  return response;
};

// menghapus buku
const deleteBook = (request, h) => {
  const { id } = request.params;

  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });

    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });

  response.code(404);
  return response;
};

module.exports = {
  addBook,
  getBookById,
  getAllBook,
  updateBook,
  deleteBook,
};
