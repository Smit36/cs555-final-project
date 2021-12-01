const mongoCollections = require('../config/mongoCollections');
const tasks = mongoCollections.tasks;
const users = mongoCollections.users;
const verify = require('../inputVerification');

/**
 * Creates an ObjectID from a valid hexadecimal string.
 * @param {String} id A string version of an ObjectID.
 * @returns An ObjectID.
 */
const createObjectId = (id) => {
  let { ObjectId } = require('mongodb');

  // verify.standard.verifyArg(id, 'id', 'tasks/createObjectId', 'objectId');

  let parsedId = ObjectId(id);
  return parsedId;
};

module.exports = {
  /**
   * Gets all tasks from the database.
   * @returns An object array of all tasks in the database.
   */

  async getAllTasks(userId) {
    // verify.standard.argDNE(arg, 'getAllTasks');
    const userCollection = await users();

    const userData = await userCollection.find({ _id: createObjectId(userId) }).toArray();
    if (!userData) throw 'Error: Could not get all tasks.';
    let result = [];
    console.log(userData);
    for (let i = 0; i < userData[0].activeTasks.length; i++) {
      result.push({
        _id: userData[0].activeTasks[i]._id.toString(),
        name: userData[0].activeTasks[i].name,
      });
    }

    return result;
  },

  /**
   * Gets a task given its object ID from the database.
   * @param {String} id String task ID for the database.
   * @returns Object of a task.
   */
  async getTaskById(id) {
    const taskCollection = await tasks();
    id = createObjectId(id);
    const task = await taskCollection.findOne({ _id: id });
    if (task) {
      task._id = task._id.toString();
    }
    return task;
  },

  /**
   * Creates a task and stores it in the database.
   * @param {String} name Name of the task.
   * @param {Number} points Experience points of the task. May be depracated.
   * @param {Number} level Difficulty level of the task.
   * @param {String} description Description of the task.
   * @returns A task object.
   */
  async addTask(userId, name, points, level, description, category, select) {
    // verify.standard.verifyArg(name, 'name', 'addTask', 'string');
    // verify.standard.verifyArg(points, 'points', 'addTask', 'number');
    // verify.standard.verifyArg(level, 'level', 'addTask', 'number');
    // verify.standard.verifyArg(description, 'description', 'addTask', 'string');

    points = parseInt(points);
    level = parseInt(level);

    const taskCollection = await tasks();
    const userCollection = await users();

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

    const user = await userCollection.findOne({ _id: createObjectId(userId) });
    if (user) {
      user._id = user._id.toString();
    }
    user.activeTasks.push(task);
    await userCollection.updateOne(
      { _id: createObjectId(userId) },
      { $set: { activeTasks: user.activeTasks } },
    );
    return task;
  },

  /**
   * Returns a random list of daily tasks that follows the format of 3 small, 2 medium, and 1 large.
   * @returns Array of daily tasks
   */

  async selectTasks(userId, anxiety, depression, disorder, schizo) {
    if (anxiety == 'true') {
      await this.addTask(userId, 'Go for a walk', 25, 1, 'It will refresh you!');
      await this.addTask(userId, 'Get to gather with your friends', 50, 2, 'It will refresh you!');
      await this.addTask(userId, 'Painting', 100, 3, 'It will refresh you!');
    }
    if (depression == 'true') {
      await this.addTask(userId, 'Go for a walk', 25, 1, 'It will refresh you!');
      await this.addTask(userId, 'Get to gather with your friends', 50, 2, 'It will refresh you!');
      await this.addTask(userId, 'Painting', 100, 3, 'It will refresh you!');
    }
    if (disorder == 'true') {
      await this.addTask(userId, 'Go for a walk', 25, 1, 'It will refresh you!');
      await this.addTask(userId, 'Get to gather with your friends', 50, 2, 'It will refresh you!');
      await this.addTask(userId, 'Painting', 100, 3, 'It will refresh you!');
    }
    if (schizo == 'true') {
      await this.addTask(userId, 'Go for a walk', 25, 1, 'It will refresh you!');
      await this.addTask(userId, 'Get to gather with your friends', 50, 2, 'It will refresh you!');
      await this.addTask(userId, 'Painting', 100, 3, 'It will refresh you!');
    }
  },
};
