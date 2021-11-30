const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const verify = require('../inputVerification');

const createObjectId = (id) => {
	let { ObjectId } = require('mongodb');

	verify.standard.verifyArg(id, 'id', 'profile/createObjectId', 'objectId');

	let parsedId = ObjectId(id);
	return parsedId;
};

module.exports = {
	async createProfile(userId) {
		verify.standard.verifyArg(
			userId,
			'userId',
			'createProfile',
			'objectId'
		);

		const userCollection = await users();
		userId = createObjectId(userId);
		const user = await userCollection.findOne({ _id: userId });

		const newProfile = {
			userId,
			name: `${user.fname} ${user.lname}`,
			gender: 'male',
			age: 22,
			weight: 160,
			height: 70,
			bmi: ((703 * 160) / (70 * 70)).toFixed(2),
			activeTasks: user.activeTasks,
			completedTasks: user.completedTasks,
			level: user.level,
			currXP: user.currXP
		};

		return newProfile;
	}
};
