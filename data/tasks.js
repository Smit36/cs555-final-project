const mongoCollections = require("../config/mongoCollections");
const tasks = mongoCollections.tasks;
const verify = require("../inputVerification");

/**
 * Creates an ObjectID from a valid hexadecimal string.
 * @param {String} id A string version of an ObjectID.
 * @returns An ObjectID.
 */
const createObjectId = (id) => {
  let { ObjectId } = require("mongodb");

  verify.standard.verifyArg(id, "id", "tasks/createObjectId", "objectId");

  let parsedId = ObjectId(id);
  return parsedId;
};

module.exports = {
  /**
   * Gets all tasks from the database.
   * @returns An object array of all tasks in the database.
   */
  async getAllTasks(arg) {
    verify.standard.argDNE(arg, "getAllTasks");
    const taskCollection = await tasks();

    const taskData = await taskCollection.find({}).toArray();
    if (!taskData) throw "Error: Could not get all tasks.";
    let result = [];
    for (let i = 0; i < taskData.length; i++) {
      result.push({
        _id: taskData[i]._id.toString(),
        name: taskData[i].name,
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
    verify.standard.verifyArg(id, "id", "getTaskById", "objectId");

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
  async addTask(name, points, level, description) {
    verify.standard.verifyArg(name, "name", "addTask", "string");
    verify.standard.verifyArg(points, "points", "addTask", "number");
    verify.standard.verifyArg(level, "level", "addTask", "number");
    verify.standard.verifyArg(description, "description", "addTask", "string");

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
    if (newInsertTask.insertedCount === 0) throw "Could not add task";

    const newId = newInsertTask.insertedId;
    const task = await this.getTaskById(newId.toString());
    return task;
  },

  /**
   * Returns a random list of daily tasks that follows the format of 3 small, 2 medium, and 1 large.
   * @returns Array of daily tasks
   */
  async getDailyTasks(arg) {
    verify.standard.argDNE(arg, "getDailyTasks");

    const taskCollection = await tasks();

    let small = await taskCollection
      .aggregate([{ $match: { points: 25 } }, { $sample: { size: 3 } }])
      .toArray();
    let medium = await taskCollection
      .aggregate([{ $match: { points: 50 } }, { $sample: { size: 2 } }])
      .toArray();
    let large = await taskCollection
      .aggregate([{ $match: { points: 100 } }, { $sample: { size: 1 } }])
      .toArray();
    const taskData = small.concat(medium, large);
    if (!taskData) throw "Error: Could not get daily tasks.";
    let result = [];
    for (let i = 0; i < taskData.length; i++) {
      result.push({
        _id: taskData[i]._id.toString(),
        name: taskData[i].name,
      });
    }

    return result;
  },
};
