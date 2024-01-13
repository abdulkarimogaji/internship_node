const axios = require("axios");
const db = require("../models");
const { getCustomers } = require("../services/shopifyService");

(async function pullCustomersCronjob() {
  console.log("*********** Starting cronjob ********", new Date());
  try {
    const shopifyCustomers = (await getCustomers()).customers;

    for (let i = 0; i < shopifyCustomers.length; i++) {
      const shopifyCustomer = shopifyCustomers[i];

      const exist = await db.customer.findOne({
        where: { shopify_customer_id: shopifyCustomer.id },
      });

      if (exist) continue;

      await db.customer.create({
        shopify_customer_id: shopifyCustomer.id,
        shopify_customer_email: shopifyCustomer.email,
      });
    }
  } catch (err) {
    console.log("An Error occurred: ", err);
  }
  console.log("*********** Ending cronjob ********", new Date());
})();
