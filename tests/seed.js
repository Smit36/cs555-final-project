const dbConnection = require("../config/mongoConnection");
//const data = require("../data");
const userData = require("../data/users");
const taskData = require("../data/tasks");

let main = async () => {
  const db = await dbConnection.connectToDb();
  await db.dropDatabase();

  try {
    //creating users
    const adam = await userData.addUser(
      "Adam",
      "Stinky",
      "astinky@stevens.edu"
    );

    const gavin = await userData.addUser("Gavin", "Pan", "gpan1@stevens.edu");

    const john = await userData.addUser("John", "Booba", "jbooba@stevens.edu");

    console.log(adam);
    console.log(gavin);
    console.log(john);

    //creating tasks

    const walk = await taskData.addTask(
      "Go for a walk",
      25,
      1,
      "Go for a walk for 10 minutes."
    );
    await taskData.addTask(
      "Brush your teeth",
      25,
      1,
      "Good oral hygiene is important."
    );
    await taskData.addTask(
      "Take a shower",
      25,
      1,
      "Cleanliness helps both physically and mentally."
    );
    await taskData.addTask("Go for a jog", 50, 2, "Go for a 15 minute jog.");
    await taskData.addTask(
      "Do a 10 minute workout video",
      50,
      2,
      "Workout videos are great ways of staying in shape in the comfort of your own room."
    );
    await taskData.addTask(
      "Do all the laundry",
      100,
      3,
      "It might not be the most fun, but you'll thank yourself later."
    );

    const bathe = await taskData.addTask(
      "Take a bath",
      100,
      3,
      "Take a bath Adam"
    );

    console.log(walk);
    console.log(bathe);

    const daily = await taskData.getDailyTasks();
    console.log(daily);

    //giving exp and levels
    const adamXP = await userData.awardExp(125, adam._id);
    const adamLevel = await userData.incrementLevel(adamXP._id.toString());
    const gavinXP = await userData.awardExp(1000, gavin._id);
    const gavinLevel = await userData.incrementLevel(gavinXP._id.toString());

    console.log(adamLevel);
    console.log(gavinLevel);
  } catch (error) {
    console.log("Oops");
  }
  console.log("Done seeding database");
  await dbConnection.closeConnection();
};

main().catch((error) => {
  console.log(error);
});
