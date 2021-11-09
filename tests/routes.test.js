const request = require("supertest");
const app = require("../app.js");

const { MongoClient } = require("mongodb");
const settings = require("../config/settings.json");
const mongoConfig = settings.mongoConfig;
const taskData = require("../data/tasks");
const userData = require("../data/users");

// Unfortunately, there is no way of checking the content of the routes via testing since errors are rendered as HTML pages
// and finding specific items in the response body is nearly impossible with such a dynamic application. However, we can make sure
// that the response code is good, which will catch any errors our code itself notices, which I feel is good enough.

// All tests will check whether the route sends a valid response since any invalid behavior will return a 500 error.

describe("Main route", () => {
  it("should send a good response", async () => {
    const response = await request(app).get("/");
    expect(response.statusCode).toBe(200);
  });
});

describe("Task route", () => {
  it("should send a good response on post", async () => {
    const response = await request(app).post("/task");
    expect(response.statusCode).toBe(200);
  });
});

describe("Task route", () => {
  it("should send a good response on get", async () => {
    const response = await request(app).get("/task");
    expect(response.statusCode).toBe(200);
  });
});

// This test does the same as the other tests, but since it requires information from the database, it has to initialize the database.
describe("Task route", () => {
  let connection;
  let db;

  beforeAll(async () => {
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

  it("should render a list of daily tasks", async () => {
    await taskData.addTask(
      "Go for a walk",
      25,
      1,
      "Go for a walk for 10 minutes."
    );
    await taskData.addTask(
      "Brush your teeth",
      25,
      1,
      "Good oral hygiene is important."
    );
    await taskData.addTask(
      "Take a shower",
      25,
      1,
      "Cleanliness helps both physically and mentally."
    );
    await taskData.addTask("Go for a jog", 50, 2, "Go for a 15 minute jog.");
    await taskData.addTask(
      "Do a 10 minute workout video",
      50,
      2,
      "Workout videos are great ways of staying in shape in the comfort of your own room."
    );
    await taskData.addTask(
      "Do all the laundry",
      100,
      3,
      "It might not be the most fun, but you'll thank yourself later."
    );
    const response = await request(app).get("/task/daily");
    expect(response.statusCode).toBe(200);
  });
});

// This test does the same as the other tests, but since it requires information from the database, it has to initialize the database.
describe("Task route", () => {
  let connection;
  let db;

  beforeAll(async () => {
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

  it("should get a task and render it properly", async () => {
    const insertedTask = await taskData.addTask(
      "Go for a walk",
      25,
      1,
      "Go for a walk for 10 minutes."
    );
    const response = await request(app).get(
      `/task/${insertedTask._id.toString()}`
    );
    expect(response.statusCode).toBe(200);
  });
});

// This test does the same as the other tests, but since it requires information from the database, it has to initialize the database.
describe("User route", () => {
  let connection;
  let db;

  beforeAll(async () => {
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

  it("should fail accessing a non-logged in user", async () => {
    const user = await userData.addUser(
      "Adam",
      "Szyluk",
      "adams",
      "sample_hashed_password",
      "aszyluk@stevens.edu"
    );
    const response = await request(app).get(`/profile/${user._id.toString()}`);
    console.log(user._id.toString());
    expect(response.statusCode).toBe(403);
  });
});
