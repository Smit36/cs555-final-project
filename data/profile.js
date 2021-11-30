const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const verify = require('../inputVerification');

const createObjectId = (id) => {
  let { ObjectId } = require('mongodb');

  //verify.standard.verifyArg(id, 'id', 'profile/createObjectId', 'objectId');

  let parsedId = ObjectId(id);
  return parsedId;
};

module.exports = {
  async createProfile(userId) {
    //verify.standard.verifyArg(userId, 'userId', 'createProfile', 'objectId');

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
