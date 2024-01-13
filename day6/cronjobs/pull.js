const axios = require("axios");
const db = require("../models");

async function fetchShopifyCustomers() {
  const headers = {
    Accept: "application/json",
    "X-Shopify-Access-Token": "677fc22817c50db81c5bba623cfbc960-1705173601",
    "Content-Type": "application/json",
  };

  // const resp = await axios.get(
  //   "https://your-development-store.myshopify.com/admin/api/2024-01/customers.json?ids=207119551%2C1073339482",
  //   { headers }
  // );
  const response = {
    customers: [
      {
        id: 1073339482,
        email: "steve.lastnameson@example.com",
        created_at: "2024-01-02T09:24:09-05:00",
        updated_at: "2024-01-02T09:24:09-05:00",
        first_name: "Steve",
        last_name: "Lastnameson",
        orders_count: 0,
        state: "disabled",
        total_spent: "0.00",
        last_order_id: null,
        note: null,
        verified_email: true,
        multipass_identifier: null,
        tax_exempt: false,
        tags: "",
        last_order_name: null,
        currency: "USD",
        phone: "+15142546011",
        addresses: [
          {
            id: 1053317315,
            customer_id: 1073339482,
            first_name: "Mother",
            last_name: "Lastnameson",
            company: null,
            address1: "123 Oak St",
            address2: null,
            city: "Ottawa",
            province: "Ontario",
            country: "Canada",
            zip: "123 ABC",
            phone: "555-1212",
            name: "Mother Lastnameson",
            province_code: "ON",
            country_code: "CA",
            country_name: "Canada",
            default: true,
          },
        ],
        tax_exemptions: [],
        email_marketing_consent: {
          state: "not_subscribed",
          opt_in_level: "single_opt_in",
          consent_updated_at: null,
        },
        sms_marketing_consent: {
          state: "not_subscribed",
          opt_in_level: "single_opt_in",
          consent_updated_at: null,
          consent_collected_from: "OTHER",
        },
        admin_graphql_api_id: "gid://shopify/Customer/1073339482",
        default_address: {
          id: 1053317315,
          customer_id: 1073339482,
          first_name: "Mother",
          last_name: "Lastnameson",
          company: null,
          address1: "123 Oak St",
          address2: null,
          city: "Ottawa",
          province: "Ontario",
          country: "Canada",
          zip: "123 ABC",
          phone: "555-1212",
          name: "Mother Lastnameson",
          province_code: "ON",
          country_code: "CA",
          country_name: "Canada",
          default: true,
        },
      },
      {
        id: 207119551,
        email: "bob.norman@mail.example.com",
        created_at: "2024-01-02T09:23:53-05:00",
        updated_at: "2024-01-02T09:23:53-05:00",
        first_name: "Bob",
        last_name: "Norman",
        orders_count: 1,
        state: "disabled",
        total_spent: "199.65",
        last_order_id: 450789469,
        note: null,
        verified_email: true,
        multipass_identifier: null,
        tax_exempt: false,
        tags: "Léon, Noël",
        last_order_name: "#1001",
        currency: "USD",
        phone: "+16136120707",
        addresses: [
          {
            id: 207119551,
            customer_id: 207119551,
            first_name: null,
            last_name: null,
            company: null,
            address1: "Chestnut Street 92",
            address2: "",
            city: "Louisville",
            province: "Kentucky",
            country: "United States",
            zip: "40202",
            phone: "555-625-1199",
            name: "",
            province_code: "KY",
            country_code: "US",
            country_name: "United States",
            default: true,
          },
        ],
        tax_exemptions: [],
        email_marketing_consent: {
          state: "not_subscribed",
          opt_in_level: null,
          consent_updated_at: "2004-06-13T11:57:11-04:00",
        },
        sms_marketing_consent: {
          state: "not_subscribed",
          opt_in_level: "single_opt_in",
          consent_updated_at: "2024-01-02T09:23:53-05:00",
          consent_collected_from: "OTHER",
        },
        admin_graphql_api_id: "gid://shopify/Customer/207119551",
        default_address: {
          id: 207119551,
          customer_id: 207119551,
          first_name: null,
          last_name: null,
          company: null,
          address1: "Chestnut Street 92",
          address2: "",
          city: "Louisville",
          province: "Kentucky",
          country: "United States",
          zip: "40202",
          phone: "555-625-1199",
          name: "",
          province_code: "KY",
          country_code: "US",
          country_name: "United States",
          default: true,
        },
      },
    ],
  };
  return response.customers;
}

(async function pullCustomersCronjob() {
  console.log("*********** Starting cronjob ********", new Date());
  try {
    const shopifyCustomers = await fetchShopifyCustomers();

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
