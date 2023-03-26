const {
  addBook,
  getBookById,
  getAllBook,
  updateBook,
  deleteBook,
} = require('./handler');
const route = [
  {
    method: 'POST',
    path: '/books',
    handler: addBook,
  },
  {
    method: 'GET',
    path: '/books',
    handler: getAllBook,
  },
  {
    method: 'GET',
    path: '/books/{id}',
    handler: getBookById,
  },
  {
    method: 'PUT',
    path: '/books/{bookId}',
    handler: updateBook,
  },
  {
    method: 'DELETE',
    path: '/books/{id}',
    handler: deleteBook,
  },
];

module.exports = route;
