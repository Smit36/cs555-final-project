// This is a test script using Jest. Jest is a test automation platform that supports TDD and BDD. This file tests the users database.

const { MongoClient } = require('mongodb');
const settings = require('../config/settings.json');
const mongoConfig = settings.mongoConfig;
const userData = require('../data/users');

// Test to add user.
describe('insert', () => {
	let connection;
	let db;

	beforeAll(async () => {
		connection = await MongoClient.connect(mongoConfig.serverUrl, {
			useNewUrlParser: true,
			useUnifiedTopology: true
		});
		db = await connection.db(mongoConfig.database);
	});

	afterAll(async () => {
		await db.dropDatabase();
		await connection.close();
	});

	it('should insert a user into database', async () => {
		const insertedUser = await userData.addUser(
			'Adam',
			'Szyluk',
			'adams',
			'sample_hashed_password',
			'aszyluk@stevens.edu'
		);
		expect(insertedUser.firstName).toEqual('Adam');
	});
});

// Test if experience gets awarded properly
describe('update', () => {
	let connection;
	let db;

	beforeAll(async () => {
		connection = await MongoClient.connect(mongoConfig.serverUrl, {
			useNewUrlParser: true,
			useUnifiedTopology: true
		});
		db = await connection.db(mongoConfig.database);
	});

	afterAll(async () => {
		await db.dropDatabase();
		await connection.close();
	});

	it('should return the experience after being updated', async () => {
		const old = await userData.addUser(
			'Adam',
			'Szyluk',
			'adams',
			'sample_hashed_password',
			'aszyluk@stevens.edu'
		);

		const user = await userData.awardExp(25, old._id);

		expect(user.currXP).toEqual(25);
	});
});

// tests if level up system works correctly
describe('update', () => {
	let connection;
	let db;

	beforeAll(async () => {
		connection = await MongoClient.connect(mongoConfig.serverUrl, {
			useNewUrlParser: true,
			useUnifiedTopology: true
		});
		db = await connection.db(mongoConfig.database);
	});

	afterAll(async () => {
		await db.dropDatabase();
		await connection.close();
	});

	it('should return the level after being updated', async () => {
		const old = await userData.addUser(
			'Gavin',
			'Szyluk',
			'gavins',
			'sample_hashed_password_2',
			'gszyluk@stevens.edu'
		);

		const closer = await userData.awardExp(125, old._id);
		const user = await userData.incrementLevel(closer._id.toString());
		expect(user.level).toEqual(3);
	});
});
