const db = require("../models");
const { Op, Sequelize } = require("sequelize");

(async function emailQueueCronjob() {
  console.log("*********** Starting cronjob ********", new Date());
  try {
    const activeUsers = await db.user.findAll({ where: { status: 1 } });

    const today = new Date();
    const day = today.getDay();

    const emailsToQueue = await db.email.findAll({
      where: {
        id: {
          [Op.and]: [
            { [Op.not]: null },
            Sequelize.literal(`(id % 2 = ${[1, 3, 5].includes(day) ? 1 : 0})`),
          ],
        },
      },
    });

    const nextDay = new Date(today);
    nextDay.setDate(today.getDate() + 1);

    for (let i = 0; i < activeUsers.length; i++) {
      const user = activeUsers[i];
      for (let i = 0; i < emailsToQueue.length; i++) {
        const email = emailsToQueue[i];
        // create queue
        await db.email_queue.create({
          user_id: user.id,
          email_id: email.id,
          status: 0,
          sent_at: nextDay.toISOString().slice(0, 19).replace("T", " "),
        });
      }
    }
  } catch (err) {
    console.log("An Error occurred: ", err);
  }
  console.log("*********** Ending cronjob ********", new Date());
})();
