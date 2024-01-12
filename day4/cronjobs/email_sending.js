const db = require("../models");
const { Op, Sequelize } = require("sequelize");
const axios = require("axios");

async function sendEmail(receiver, subject, body) {
  try {
    const headers = {
      Accept: "application/json",
      "Api-Token": "21b5a3540e0ca9910b395e6ea1a6598a",
      "Content-Type": "application/json",
    };

    await axios.post(
      "https://stoplight.io/mocks/railsware/mailtrap-api-docs/93404133/api/send",
      {
        to: [
          {
            email: receiver,
            name: "Receiver's name",
          },
        ],
        from: {
          email: "sales@example.com",
          name: "Example Sales Team",
        },
        subject: subject,
        text: body,
      },
      { headers }
    );
    return true;
  } catch (err) {
    console.log("err", err);
    return false;
  }
}

function replaceVariables(str, variableObj) {
  Object.entries(variableObj).forEach(([variable, value]) => {
    str = str.replace(`{{{${variable}}}}`, value);
  });
  return str;
}

(async function emailSendingCronjob() {
  console.log("*********** Starting cronjob ********", new Date());
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const queues = await db.email_queue.findAll({
      where: {
        sent_at: {
          [Op.gte]: today,
          [Op.lt]: new Date(today.getTime() + 24 * 60 * 60 * 1000),
        },
        status: { [Op.eq]: 0 },
      },
      include: [
        {
          attributes: ["subject", "body"],
          model: db.email,
          where: { id: Sequelize.col("email_queue.email_id") },
        },
        {
          attributes: ["email", "name"],
          model: db.user,
          where: { id: Sequelize.col("email_queue.user_id") },
        },
      ],
    });

    for (let i = 0; i < queues.length; i++) {
      const queue = queues[i];
      const subject = replaceVariables(queue.email.subject, {
        name: queue.user.name,
        email: queue.user.email,
      });
      const html = replaceVariables(queue.email.html, {
        name: queue.user.name,
        email: queue.user.email,
      });

      const sent = await sendEmail(queue.user.email, subject, html);
      if (sent) {
        // mark as sent
        await db.email_queue.update(
          {
            status: 1,
          },
          { where: { id: queue.id } }
        );
      }
    }
  } catch (err) {
    console.log("An Error occurred: ", err);
  }
  console.log("*********** Ending cronjob ********", new Date());
})();
