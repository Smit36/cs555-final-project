// some fuinctions for user collection
const mongoCollections = require('../config/mongoCollections');
const taskModule = require('./tasks');
const users = mongoCollections.users;
const tasks = mongoCollections.tasks;

// returns mongodb-approved ObjectId
const createObjectId = (id) => {
	let { ObjectId } = require('mongodb');

	if (id === undefined) throw 'Id parameter must be exist';
	if (typeof id !== 'string' || id.trim().length == 0)
		throw 'Id must be a string and must not be empty.';

	let parsedId = ObjectId(id);
	return parsedId;
};

module.exports = {
	// returns all users in js array
	/**
	 * outputs all users in the collection
	 * @returns array containing all users in collection
	 */
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

	// returns one specific user given valid id
	/**
	 * returns one user given their id
	 * @param {string} id valid ObjectId of user to return
	 * @returns user with provided ObjectId
	 */
	async getUserById(id) {
		// begin error checking on function arguments
		if (id === undefined) throw 'You must provide an id.';
		if (
			typeof id !== 'string' ||
			id.trim().length == 0 ||
			id.length !== 24
		)
			throw 'id must be a valid ObjectId.';
		// end error checking on arguments

		const userCollection = await users();
		id = createObjectId(id);
		const user = await userCollection.findOne({ _id: id });
		if (user) {
			user._id = user._id.toString();
		}
		return user;
	},
	/**
	 * creates a new user, adding them to the collection
	 * @param {string} fname user's first name
	 * @param {string} lname user's last name
	 * @param {string} companyEmail user's unique companyEmail
	 * @returns userObj after inserted into collection
	 */
	async addUser(fname, lname, companyEmail) {
		// begin error checking on function arguments
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
		// end error checking on arguments

		const userCollection = await users();

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
			currXP
		};

		const newInsertUser = await userCollection.insertOne(newUser);
		if (newInsertUser.insertedCount === 0) throw 'Could not add user';

		const newId = newInsertUser.insertedId;
		const user = await this.getUserById(newId.toString());
		return user;
	},
	/**
	 * Adds a task to the completed field of user, awarding xp appropiately
	 * @param {string} userId user to add the task to
	 * @param {string} taskId task to add to the user
	 * @returns updated user object
	 */
	async markTaskCompleted(userId, taskId) {
		// error check on userId
		if (userId === undefined) throw 'You must provide a userId.';
		if (
			typeof userId !== 'string' ||
			userId.trim().length == 0 ||
			userId.length !== 24
		)
			throw 'userId must be a valid ObjectId.';

		// error check on taskId
		if (taskId === undefined) throw 'You must provide a taskId.';
		if (
			typeof taskId !== 'string' ||
			taskId.trim().length == 0 ||
			taskId.length !== 24
		)
			throw 'taskId must be a valid ObjectId.';

		const userCollection = await users();
		const taskCollection = await tasks();

		const user_to_update = await this.getUserById(userId);
		const task_to_add = await taskModule.getTaskById(taskId);

		const newCompletedTasks =
			user_to_update.completedTasks.push(task_to_add);
		const newLevel = user_to_update.level + todofunction();
		const newCurrXP = user_to_update.currXP + todofunction();

		const updatedUser = {
			fname: user_to_update.fname,
			lname: user_to_update.lname,
			companyEmail: user_to_update.companyEmail,
			activeTasks: user_to_update.activeTasks,
			completedTasks: newCompletedTasks,
			level: newLevel,
			currXP: newCurrXP
		};

		const updatedInfo = await users.updateOne(
			{ _id: ObjectId(id) },
			{ $set: updatedUser }
		);
		if (updatedInfo.modifiedCount === 0) {
			throw `Could not update user with id ${id}`;
		}

		let retVal = await this.getUserById(id);
		retVal._id = retVal._id.toString();
		return retVal;
	}
};
