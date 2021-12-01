const dbConnection = require('../config/mongoConnection');
const taskData = require('../data/tasks');

let main = async () => {
  const db = await dbConnection.connectToDb();
  await db.dropDatabase();

  try {
    //creating tasks

    const walk = await taskData.addTask('Go for a walk', 25, 1, 'Go for a walk for 10 minutes.');
    await taskData.addTask('Brush your teeth', 25, 1, 'Good oral hygiene is important.');
    await taskData.addTask(
      'Take a shower',
      25,
      1,
      'Cleanliness helps both physically and mentally.',
    );
    await taskData.addTask('Go for a jog', 50, 2, 'Go for a 15 minute jog.');
    await taskData.addTask(
      'Do a 10 minute workout video',
      50,
      2,
      'Workout videos are great ways of staying in shape in the comfort of your own room.',
    );
    await taskData.addTask(
      'Do all the laundry',
      100,
      3,
      "It might not be the most fun, but you'll thank yourself later.",
    );

    const bathe = await taskData.addTask('Take a bath', 100, 3, 'Take a bath Adam');

    console.log(walk);
    console.log(bathe);

    const daily = await taskData.getDailyTasks();
    console.log(daily);
  } catch (error) {
    console.log('Oops');
  }
  console.log('Done seeding database');
  await dbConnection.closeConnection();
};

main().catch((error) => {
  console.log(error);
});
