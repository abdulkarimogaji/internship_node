const db = require("../models");
const { QueryTypes } = require("sequelize");
const axios = require("axios");
const { sqlDateTimeFormat } = require("../services/UtilsService");

async function sendEmail(receiver, subject, body) {
  try {
    const headers = {
      Accept: "application/json",
      "Api-Token": "21b5a3540e0ca9910b395e6ea1a6598a",
      "Content-Type": "application/json",
    };

    const resp = await axios.post(
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
    console.log("resp", resp);
    return true;
  } catch (err) {
    console.log("err", err);
    return false;
  }
}

function replaceVariables(str, variableObj) {
  Object.entries(variableObj).forEach(([variable, value]) => {
    str = str.replace(new RegExp(`{{{${variable}}}}`, "g"), value);
  });
  return str;
}

(async function emailSendingCronjob() {
  console.log("*********** Starting cronjob ********", new Date());
  try {
    const today = new Date();
    today.setHours(1, 0, 0, 0);

    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

    const queues = await db.sequelize.query(
      `SELECT
        email_queue.id,
        email_queue.sent_at,
        email.subject,
        email.body,
        user.email,
        user.name,
        email_queue.email_id,
        email_queue.user_id,
        email_queue.status AS queue_status
      FROM
        email_queue
        LEFT JOIN email ON email.id = email_queue.email_id
        LEFT JOIN user ON user.id = email_queue.user_id
      WHERE
        email_queue.status = 0 AND email_queue.sent_at >= '${sqlDateTimeFormat(
          today
        )}' AND email_queue.sent_at < '${sqlDateTimeFormat(tomorrow)}' ;
    `,
      { type: QueryTypes.SELECT }
    );

    for (let i = 0; i < queues.length; i++) {
      const queue = queues[i];
      const subject = replaceVariables(queue.subject, {
        name: queue.name,
        email: queue.email,
      });
      const html = replaceVariables(queue.body, {
        name: queue.name,
        email: queue.email,
      });

      const sent = await sendEmail(queue.email, subject, html);
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
