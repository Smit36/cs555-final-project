// This is a test script using Jest. Jest is a test automation platform that supports TDD and BDD. This file tests the users database.

const { MongoClient } = require("mongodb");
const settings = require("../config/settings.json");
const mongoConfig = settings.mongoConfig;
const userData = require("../data/users");

// Test to add user.
describe("insert", () => {
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
    await connection.close();
    await db.close();
  });

  it("should insert a user into database", async () => {
    const insertedUser = await userData.addUser(
      "Adam",
      "Szyluk",
      "aszyluk@stevens.edu"
    );
    expect(insertedUser.fname).toEqual("Adam");
  });
});

// Test if experience gets awarded properly
describe("update", () => {
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
    await connection.close();
    await db.close();
  });

  it("should return the experience after being updated", async () => {
    const user = await userData.addUser(
      "Adam",
      "Szyluk",
      "aszyluk@stevens.edu"
    );

    await userData.awardExp(0, user._id);

    expect(user.currXP).toEqual(25);
  });
});

  // tests if level up system works correctly
  describe("update", () => {
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
      await connection.close();
      await db.close();
    });
  
    it("should return the level after being updated", async () => {
      const user = await userData.addUser(
        "Gavin",
        "Szyluk",
        "gszyluk@stevens.edu"
      );
  
      await userData.awardExp(125, user._id);
      console.log(user.level);
      expect(user.level).toEqual(3);
    });
});
