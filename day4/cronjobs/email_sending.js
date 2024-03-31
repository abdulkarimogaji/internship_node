const db = require("../models");
const { QueryTypes } = require("sequelize");
const axios = require("axios");
const { sqlDateTimeFormat } = require("../services/UtilsService");
const nodemailer = require("nodemailer");

function sendEmail(receiver, subject, body) {
  var transporter = nodemailer.createTransport({
    host: "mail.mkdlabs.com",
    port: 465,
    secure: true, // use SSL
    auth: {
      user: "info@mkdlabs.com",
      pass: "1rmw8ya843P=",
    },
  });
  return new Promise((resolve, reject) => {
    transporter.sendMail(
      {
        sender: "info@mkdlabs.com",
        to: receiver,
        html: body,
        subject,
      },
      (err, result) => {
        if (err) reject(err);
        resolve(result);
      }
    );
  });
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
