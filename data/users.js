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
	async getAllUsers() {
		const userCollection = await users();

		const userData = await userCollection.find({}).toArray();
		let result = [];
		for (let i = 0; i < userData.length; i++) {
			result.push({
				_id: userData[i]._id.toString(),
				name: userData[i].name
			});
		}

		return result;
	},

	async getUserById(id) {
		if (id === undefined) throw 'You must provide an id.';
		if (
			typeof id !== 'string' ||
			id.trim().length == 0 ||
			id.length !== 24
		)
			throw 'id must be a type of string and must not be empty and must be a length of 24.';

		const userCollection = await users();
		id = createObjectId(id);
		const user = await userCollection.findOne({ _id: id });
		if (user) {
			user._id = user._id.toString();
		}
		return user;
	},

	async addUser(fname, lname, companyEmail) {
		if (
			fname === undefined ||
			lname === undefined ||
			companyEmail === undefined
		)
			throw 'All fields must be provided.';
		if (typeof fname !== 'string') throw 'Name must be string.';
		if (typeof lname !== 'string') throw 'Name must be string.';
		if (typeof companyEmail !== 'string')
			throw 'Description must be string';

		const userCollection = await tasks();

		let activeTasks = [],
			completedTasks = [],
			level = 0,
			currXP = 0;

		const newUser = {
			fname,
			lname,
			companyEmail,
			activeTasks,
			completedTasks,
			level,
			currXP
		};

		const newInsertUser = await userCollection.insertOne(newUser);
		if (newInsertUser.insertedCount === 0) throw 'Could not add user';

		const newId = newInsertUser.insertedId;
		const user = await this.getUserById(newId.toString());
		return user;
	}
};
