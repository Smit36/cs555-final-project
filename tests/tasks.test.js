// This is a test script using Jest. Jest is a test automation platform that supports TDD and BDD. This file tests the tasks database.

const { MongoClient } = require("mongodb");
const settings = require("../config/settings.json");
const mongoConfig = settings.mongoConfig;
const taskData = require("../data/tasks");

// Test to add task.
describe("insert", () => {
  let connection;
  let db;

  beforeAll(async () => {
    setTimeout(60000);
    connection = await MongoClient.connect(mongoConfig.serverUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = await connection.db(mongoConfig.database);
  });

  afterAll(async () => {
    await db.dropDatabase();
    await connection.close();
  });

  it("should insert a task into database", async () => {
    const insertedTask = await taskData.addTask(
      "Go for a walk",
      25,
      1,
      "Go for a walk for 10 minutes."
    );
    expect(insertedTask.name).toEqual("Go for a walk");
  });
});

// Test getting all tasks.
describe("insert", () => {
  let connection;
  let db;

  beforeAll(async () => {
    setTimeout(60000);
    connection = await MongoClient.connect(mongoConfig.serverUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = await connection.db(mongoConfig.database);
  });

  afterAll(async () => {
    await db.dropDatabase();
    await connection.close();
  });

  it("should insert a task into database", async () => {
    try {
      await taskData.addTask(
        "Go for a walk",
        25,
        1,
        "Go for a walk for 10 minutes."
      );
      const data = await taskData.getAllTasks();
      expect(data[0].name).toEqual("Go for a walk");
    } catch (e) {
      expect(e).toMatch("Error: Could not get all tasks.");
    }
  });
});

// Test getting task from ID.
describe("insert", () => {
  let connection;
  let db;

  beforeAll(async () => {
    setTimeout(60000);
    connection = await MongoClient.connect(mongoConfig.serverUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = await connection.db(mongoConfig.database);
  });

  afterAll(async () => {
    await db.dropDatabase();
    await connection.close();
  });

  it("should insert a task into database", async () => {
    try {
      const insertedTask = await taskData.addTask(
        "Go for a walk",
        25,
        1,
        "Go for a walk for 10 minutes."
      );
      const task = await taskData.getTaskById(insertedTask._id.toString());
      expect(task.name).toEqual("Go for a walk");
    } catch (e) {
      expect(e).toMatch("Error: Could not get all tasks.");
    }
  });
});
