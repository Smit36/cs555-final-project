// some fuinctions for user collection
const mongoCollections = require('../config/mongoCollections');
const taskModule = require('./tasks');
const users = mongoCollections.users;

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
	async addUser(fname, lname, username, hashedpassword, companyEmail) {
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

		const checkEmail = userCollection.findOne({
			companyEmail: companyEmail
		});
		if (checkEmail) {
			throw `Email ${companyEmail} is already registered to an account`;
		}

		const checkUsername = userCollection.findOne({
			username: username
		});
		if (checkUsername) {
			throw `Username ${username} is already taken`;
		}

		// fields to be added to the user
		// but not supplied as arguments to the function
		let activeTasks = [],
			completedTasks = [],
			level = 1,
			currXP = 0;

		// the user obj to be added to the collection
		const newUser = {
			firstName: fname,
			lastName: lname,
			companyEmail: companyEmail,
			activeTasks: activeTasks,
			completedtasks: completedTasks,
			level: level,
			currXP: currXP,
			hashedpassword: hashedpassword
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

		const user_to_update = await this.getUserById(userId);
		const task_to_add = await taskModule.getTaskById(taskId);

		const newCompletedTasks =
			user_to_update.completedTasks.push(task_to_add);
		const newLevel = user_to_update.level + this.incrementLevel(userId);
		const newCurrXP =
			user_to_update.currXP + this.awardExp(task_to_add.level, userId);

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
			{ _id: createObjectId(userId) },
			{ $set: updatedUser }
		);
		if (updatedInfo.modifiedCount === 0) {
			throw `Could not update user with id ${userId}`;
		}

		let retVal = await this.getUserById(userId);
		retVal._id = retVal._id.toString();
		return retVal;
	},
	/**
	 * awardExp awards experience to the user based on the level of the task.
	 * Level 1 task = 25 points.
	 * Level 2 task = 50 points.
	 * Level 3 task = 100 points.
	 * @param {Number} exp Number greater than 0 that is a multiple of 25.
	 * @param {String} userID String of the ID of the user in the database.
	 */
	async awardExp(exp, userID) {
		// Error checking
		const id = createObjectId(userID);
		if (!exp || typeof exp !== 'number' || exp < 0 || exp % 25 !== 0)
			throw 'Error: Invalid Experience Count';

		const userCollection = await users();

		// Increment current experience by the experience given by the taskLevel
		const user = await userCollection.updateOne(
			{ _id: id },
			{ $inc: { currXP: exp } }
		);

		if (user.modifiedCount === 0)
			throw 'Could not update user experience.';

		const newUser = await this.getUserById(userID);
		return newUser;
	},
	/**
 * Levels up user based on this
 * Levels        Exp needed for next tier
 * 	1                     50
    2	                  75
    3	                  100
    4	                  150
    5	                  200
  After 5           level*100-300
 * @param {String} userID String of the ID of the user in the database.
 * @returns 0 
 */
	async incrementLevel(userID) {
		const userCollection = await users(); // pulling stuff from database
		const id = createObjectId(userID);
		let stopleveling = true;
		let finalUserObject;

		while (stopleveling) {
			//while stopleveling is true loop
			let user = await this.getUserById(userID);
			let levelz = user.level;
			let newExp = user.currXP;
			let neededExp;
			//checks how much exp is needed for next level
			if (levelz < 6) {
				if (levelz === 1) {
					neededExp = 50;
				} else if (levelz == 2) {
					neededExp = 75;
				} else if (levelz === 3) {
					neededExp = 100;
				} else if (levelz === 4) {
					neededExp = 150;
				} else {
					neededExp = 200;
				}
			} else {
				neededExp = levelz * 100 - 300;
			}
			//checks if exp is enough to level up
			if (newExp >= neededExp) {
				newExp = newExp - neededExp;
				const user = userCollection.updateOne(
					{ _id: id },
					{ $set: { level: levelz + 1, currXP: newExp } } //updates all values
				);
				if (user.modifiedCount === 0)
					throw 'Could not update user experience.'; //error checking
			} else {
				stopleveling = false; //stops loop if not enough exp
				finalUserObject = user;
			}
		}
		return finalUserObject; //placeholder
	}
};
