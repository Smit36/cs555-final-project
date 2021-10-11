const mongoCollections = require('../config/mongoCollections');
const tasks = mongoCollections.tasks;

const createObjectId = (id) => {
  let { ObjectId } = require('mongodb');

  if (id === undefined) throw 'Id parameter must be exist';
  if (typeof id !== 'string' || id.trim().length == 0)
    throw 'Id must be a string and must not be empty.';

  let parsedId = ObjectId(id);
  return parsedId;
};

module.exports = {
  async getAllTasks() {
    const taskCollection = await tasks();

    const taskData = await taskCollection.find({}).toArray();
    let result = [];
    for (let i = 0; i < taskData.length; i++) {
      result.push({ _id: taskData[i]._id.toString(), name: taskData[i].name });
    }

    return result;
  },

  async getTaskById(id) {
    if (id === undefined) throw 'You must provide an id.';
    if (typeof id !== 'string' || id.trim().length == 0 || id.length !== 24)
      throw 'id must be a type of string and must not be empty and must be a length of 24.';

    const taskCollection = await tasks();
    id = createObjectId(id);
    const task = await taskCollection.findOne({ _id: id });
    if (task) {
      task._id = task._id.toString();
    }
    return task;
  },

  async addTask(name, points, level, description) {
    if (
      (name === undefined ||
        points === undefined ||
        level === undefined ||
        description === undefined)
    )
      throw 'All fields must be provided.';
    if (typeof name !== 'string') throw 'Name must be string.';
    if (typeof points !== 'number') throw 'Points must be number.';
    if (typeof level !=='number') throw 'Level must be number';
    if (typeof description !=='string') throw 'Description must be string';

    const taskCollection = await tasks();

    const newTask = {
      name,
      points,
      level,
      description
    };

    const newInsertTask = await taskCollection.insertOne(newTask);
    if (newInsertTask.insertedCount === 0) throw 'Could not add task';

    const newId = newInsertTask.insertedId;
    const task = await this.getTaskById(newId.toString());
    return task;
  },

  async deleteBook(id) {
    if (id === undefined) throw 'You must provide an id.';
    if (typeof id !== 'string' || id.trim().length == 0 || id.length !== 24)
      throw 'id must be a type of string and must not be empty and must be a length of 24.';

    id = createObjectId(id);

    const bookCollection = await books();
    let deleteBook = await bookCollection.deleteOne({ _id: id });

    if (deleteBook.deletedCount === 0) {
      throw `Could not delete book with id of ${id}`;
    }
    deleteBook = {
      bookId: id,
      deleted: true,
    };

    return deleteBook;
  },

  async updateBook(id, book) {
    if (id === undefined) throw 'You must provide an id.';
    if (typeof id !== 'string' || id.trim().length == 0)
      throw 'id must be a type of string and cannot be an empty string.';
    if (book.title && typeof book.title !== 'string') throw 'Title must be string.';
    if (book.author && (typeof book.author !== 'object' || book.author === null))
      throw 'Author must be an object.';
    if (book.author) {
      if (
        (book.author.authorFirstName || book.author.authorLastName) &&
        (typeof book.author.authorFirstName !== 'string' ||
          typeof book.author.authorLastName !== 'string' ||
          book.author.authorFirstName === undefined ||
          book.author.authorLastName === undefined)
      )
        throw 'Author firstName and lastName must be passed and must be string.';
    }

    if (book.summary && typeof book.summary !== 'string') throw 'Summary must be string.';

    if (book.genre && (!Array.isArray(book.genre) || book.genre.length < 1))
      throw 'Genre must be array of atleast one element.';

    if (
      book.datePublished &&
      (typeof book.datePublished !== 'string' ||
        !/^(0?[1-9]|1[0-2])[\/]([0-2][0-9]|3[01])[\/]\d{4}$/.test(book.datePublished))
    )
      throw 'Invalid datePublished format';

    const stringId = id;
    id = createObjectId(id);

    const bookCollection = await books();

    const bookData = await bookCollection.findOne({ _id: id });
    if (bookData === undefined) throw 'No book found with this id';

    let updateBook = {};
    if (book.title) {
      updateBook.title = book.title;
    }

    if (book.author) {
      updateBook.author = book.author;
    }

    if (book.genre) {
      updateBook.genre = book.genre;
    }

    if (book.datePublished) {
      updateBook.datePublished = book.datePublished;
    }

    if (book.summary) {
      updateBook.summary = book.summary;
    }

    if (book.review) {
      updateBook.review = updateBook.review;
    }
    updateBook = await bookCollection.updateOne({ _id: id }, { $set: updateBook });
    if (!updateBook.modifiedCount && !updateBook.matchedCount) {
      throw 'Could not update book details successfully, because id is invalid.';
    }
    updateBook = await this.getBookById(stringId);
    return updateBook;
  },
};
