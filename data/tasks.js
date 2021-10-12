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
      name === undefined ||
      points === undefined ||
      level === undefined ||
      description === undefined
    )
      throw 'All fields must be provided.';
    if (typeof name !== 'string') throw 'Name must be string.';
    if (!parseInt(points)) throw 'Points must be number.';
    if (!parseInt(level)) throw 'Level must be number';
    if (typeof description !== 'string') throw 'Description must be string';

    points = parseInt(points);
    level = parseInt(level);

    const taskCollection = await tasks();

    const newTask = {
      name,
      points,
      level,
      description,
    };

    const newInsertTask = await taskCollection.insertOne(newTask);
    if (newInsertTask.insertedCount === 0) throw 'Could not add task';

    const newId = newInsertTask.insertedId;
    const task = await this.getTaskById(newId.toString());
    return task;
  },
};
