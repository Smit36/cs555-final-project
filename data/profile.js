const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;

const createObjectId = (id) => {
  let { ObjectId } = require('mongodb');

  if (id === undefined) throw 'Id parameter must be exist';
  if (typeof id !== 'string' || id.trim().length == 0)
    throw 'Id must be a string and must not be empty.';

  let parsedId = ObjectId(id);
  return parsedId;
};

module.exports = {
  async createProfile(userId) {
    if (userId === undefined) throw 'You must provide an userId.';
    if (typeof userId !== 'string' || userId.trim().length == 0 || userId.length !== 24)
      throw 'userId must be a type of string and must not be empty and must be a length of 24.';

    const userCollection = await users();
    userId = createObjectId(userId);
    const user = await userCollection.findOne({ _id: userId });

    const newProfile = {
      userId,
      name: `${user.firstName} ${user.lastName}`,
      gender: ' ',
      age: '',
      weight: '',
      height: '',
      bmi: '',
      activeTasks: user.activeTasks.length,
      completedTasks: user.completedtasks.length,
      level: user.level,
      currXP: user.currXP,
    };

    return newProfile;
  },
};
