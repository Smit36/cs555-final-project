// some fuinctions for user collection
const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;

// returns mongodb-approved ObjectId
const createObjectId = (id) => {
  let { ObjectId } = require("mongodb");

  if (id === undefined) throw "Id parameter must be exist";
  if (typeof id !== "string" || id.trim().length == 0)
    throw "Id must be a string and must not be empty.";

  let parsedId = ObjectId(id);
  return parsedId;
};

/**
 * awardExp awards experience to the user based on the level of the task.
 * Level 0 task = 25 points.
 * Level 1 task = 50 points.
 * Level 2 task = 100 points.
 * @param {*} taskLevel Number from 0 to 2.
 * @param {*} userID String of the ID of the user in the database.
 */
const awardExp = async (taskLevel, userID) => {
  // Error checking
  const id = createObjectId(userID);
  if (
    !taskLevel ||
    typeof taskLevel !== "number" ||
    taskLevel < 0 ||
    taskLevel > 2
  )
    throw "Error: Invalid Task Level";

  let exp;
  const userCollection = await users();

  // level 0 is small, level 1 is medium, level 2 is large.
  if (taskLevel === 0) {
    exp = 25;
  } else if (taskLevel === 1) {
    exp = 50;
  } else {
    exp = 100;
  }

  // Increment current experience by the experience given by the taskLevel
  const user = userCollection.updateOne(
    { _id: id },
    { $inc: { currExp: exp } }
  );

  if (user.modifiedCount === 0) throw "Could not update user experience.";

  const newUser = await this.getUserById(userID);
  return newUser;
};

module.exports = {
  // returns all users in js array
  async getAllUsers() {
    const userCollection = await users();

    const userData = await userCollection.find({}).toArray();
    let result = [];
    for (let i = 0; i < userData.length; i++) {
      result.push({
        _id: userData[i]._id.toString(),
        name: userData[i].name,
      });
    }

    return result;
  },

  async getUserById(id) {
    // returns one specific user given valid id

    // begin error checking on function arguments
    if (id === undefined) throw "You must provide an id.";
    if (typeof id !== "string" || id.trim().length == 0 || id.length !== 24)
      throw "id must be a valid ObjectId.";
    // end error checking on arguments

    const userCollection = await users();
    id = createObjectId(id);
    const user = await userCollection.findOne({ _id: id });
    if (user) {
      user._id = user._id.toString();
    }
    return user;
  },

  async addUser(fname, lname, companyEmail) {
    // adds a user to the collection

    // begin error checking on function arguments
    if (
      fname === undefined ||
      lname === undefined ||
      companyEmail === undefined
    )
      throw "All fields must be provided.";
    if (typeof fname !== "string") throw "Name must be string.";
    if (typeof lname !== "string") throw "Name must be string.";
    if (typeof companyEmail !== "string") throw "Description must be string";
    // end error checking on arguments

    const userCollection = await tasks();

    // fields to be added to the user
    // but not supplied as arguments to the function
    let activeTasks = [],
      completedTasks = [],
      level = 0,
      currXP = 0;

    // the user obj to be added to the collection
    const newUser = {
      fname,
      lname,
      companyEmail,
      activeTasks,
      completedTasks,
      level,
      currXP,
    };

    const newInsertUser = await userCollection.insertOne(newUser);
    if (newInsertUser.insertedCount === 0) throw "Could not add user";

    const newId = newInsertUser.insertedId;
    const user = await this.getUserById(newId.toString());
    return user;
  },
  awardExp,
};
