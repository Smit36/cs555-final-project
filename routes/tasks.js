const express = require('express');
const router = express.Router();

const data = require('../data');
const taskData = data.tasks;
const userData = data.users;

// The route that sends the results of a form to the server to create a task.
router.post('/', async (req, res) => {
  try {
    if (!req.session.user) {
      return res.redirect('/signup');
    }
    const task = req.body;
    if (!task.name || task.name.length == 0)
      return res.render('tasks/home', {
        name_error: 'You must provide task name',
      });
    if (!task.points)
      return res.render('tasks/home', {
        points_error: 'You must provide task experience count',
      });
    if (!task.description)
      return res.render('tasks/home', {
        description_error: 'You must provide task experience count',
      });
    if (!task.level)
      return res.render('tasks/home', {
        level_error: 'You must provide task experience count',
      });
    const { name, points, description, level } = task;
    await taskData.addTask(req.session.user.id, name, points, level, description);
    res.status(200).render('tasks/home', {
      title: 'Wellness',
      success: 'Created Successfully!',
    });
  } catch (e) {
    console.log(e);
    res.status(400).render('errors/error', { error: e });
  }
});

router.post('/completeTask/:id', async (req, res) => {
  try {
    if (!req.session.user) {
      return res.redirect('/signup');
    }
    console.log('hi');
    const { id: taskId } = req.params;
    await userData.markTaskCompleted(req.session.user.id, taskId);
    return res.redirect('/task');
  } catch (e) {
    console.log(e);
    res.status(500).render('errors/error', { error: e });
  }
});

// Gets a list of daily tasks and provides it to the user.
router.get('/daily', async (req, res) => {
  try {
    if (!req.session.user) {
      return res.redirect('/signup');
    }
    const dailyTasks = await taskData.getAllTasks(req.session.user.id);
    res.render('tasks/list', {
      title: 'Wellness',
      taskTitle: 'Daily Tasks',
      task: [dailyTasks[Math.floor(Math.random() * dailyTasks.length)]],
    });
  } catch (e) {
    console.log(e);
    res.status(500).render('errors/error', { error: e });
  }
});

// Sends the HTML page describing a task to the user when directed to the appropriate url.
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
    res.render('tasks/show', { title: task.name, task: task });
  } catch (e) {
    return res.status(400).render('errors/error', { error: e });
  }
});

// Gets a list of all tasks in the database and provides it to the user.
router.get('/', async (req, res) => {
  try {
    if (!req.session.user) {
      return res.redirect('/signup');
    }
    const tasks = await taskData.getAllTasks(req.session.user.id);
    res.render('tasks/list', { title: 'Active Tasks', taskTitle: 'Active Tasks', task: tasks });
  } catch (e) {
    console.log(e);
    res.status(500).render('errors/error', { error: e });
  }
});

router.post('/selectTask', async (req, res) => {
  try {
    if (!req.session.user) {
      return res.redirect('/signup');
    }
    const { anxiety, disorder, depression, schizo } = req.body;
    await taskData.selectTasks(req.session.user.id, anxiety, disorder, depression, schizo);
    return res.redirect('/');
  } catch (e) {
    console.log(e);
    res.status(500).render('errors/error', { error: e });
  }
});

module.exports = router;
