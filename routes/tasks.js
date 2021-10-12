const express = require('express');
const router = express.Router();

const data = require('../data');
const taskData = data.tasks;

router.post('/', async (req, res) => {
  try {
    const task = req.body;
    if (!task.name || task.name.length == 0)
      return res.render('tasks/home', { name_error: 'You must provide task name' });
    if (!task.points)
      return res.render('tasks/home', { points_error: 'You must provide task experience count' });
    if (!task.description)
      return res.render('tasks/home', {
        description_error: 'You must provide task experience count',
      });
    if (!task.level)
      return res.render('tasks/home', {
        level_error: 'You must provide task experience count',
      });
    const { name, points, description, level } = task;
    const newTask = await taskData.addTask(name, points, level, description);
    res.status(200).render('tasks/home', { success: 'Created Successfully!' });
  } catch (e) {
    res.status(400).render('errors/error', { error: e });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: 'Id must be passed as a parameter.' });
    }
    const task = await taskData.getTaskById(id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found with provided ID.' });
    }
    res.render('tasks/show', { task: task });
  } catch (e) {
    return res.status(400).json({ error: e });
  }
});

router.get('/', async (req, res) => {
  try {
    const tasks = await taskData.getAllTasks();
    console.log(tasks);
    res.render('tasks/list', { title: 'Wellness', task: tasks });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: e });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const book = req.body;
    if (!book.title || !book.author || !book.genre || !book.datePublished || !book.summary) {
      return res.status(400).json({ error: 'You must provide all fields for book.' });
    }
    const data = await bookData.getBookById(req.params.id);
    if (!data) {
      return res.status(404).json({ error: 'Book not found' });
    }
    const updateBook = await bookData.updateBook(req.params.id, book);
    res.status(200).json(updateBook);
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: e });
  }
});

router.delete('/:id', async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({ error: 'You must Supply an ID to delete' });
  }
  try {
    const deletedBook = await bookData.getBookById(req.params.id);
    if (!deletedBook) return res.status(404).json({ error: 'Book not found with provided ID.' });

    const updateBook = await bookData.deleteBook(req.params.id);
    res.status(200).json(updateBook);
  } catch (e) {
    res.status(400).json({ error: e });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ error: 'You must Supply an ID to update.' });
    }
    const book = req.body;
    let updateBook = {};
    const oldBookData = await bookData.getBookById(req.params.id);
    if (book.title && book.title !== oldBookData.title) {
      updateBook.title = book.title;
    }
    if (book.author && book.author !== oldBookData.author) {
      updateBook.author = book.author;
    }
    if (book.genre && book.genre !== oldBookData.genre) {
      updateBook.genre = book.genre;
    }

    if (book.datePublished && book.datePublished !== oldBookData.datePublished) {
      updateBook.datePublished = book.datePublished;
    }

    if (book.summary && book.summary !== oldBookData.summary) {
      updateBook.summary = book.summary;
    }
    if (Object.keys(updateBook).length !== 0) {
      const updatedBook = await bookData.updateBook(req.params.id, updateBook);
      res.json(updatedBook);
    } else {
      res.status(400).json({
        error: 'No fields have been changed from their inital values, so no update has occurred',
      });
    }
  } catch (e) {
    console.log(e);
    res.status(400).json({ error: e });
  }
});

module.exports = router;
