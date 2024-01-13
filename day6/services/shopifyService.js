const axios = require("axios");
const shopifyUrl =
  "https://65c3c809c002379e3a0ea04aeaf2cf84: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@roving-house.myshopify.com";
const graphQlUrl = `${shopifyUrl}/admin/api/2021-07/graphql.json`;

async function getUnFulfilledOrders() {
  const orders = await axios.get(
    `${shopifyUrl}/admin/api/2021-07/orders.json?fulfillment_status=unfulfilled&limit=250`
  );

  const orderIds = orders?.data?.orders.map((order, index) => ({
    sys_index: index,
    order_id: order.id,
    customer_id: order.customer.id,
    email: order.email,
    customer_name:
      (order.customer.first_name && order.customer.first_name.length > 0
        ? order.customer.first_name
        : "") +
      " " +
      (order.customer.last_name && order.customer.last_name.length > 0
        ? order.customer.last_name
        : ""),
    line_items: order.line_items,
    year_month:
      order.created_at.split("-")[0] + "-" + order.created_at.split("-")[1],
    created_at: order.created_at.split("T")[0],
  }));
  return orderIds;
}

async function getOrderSingle(orderId) {
  return await axios.get(
    `${shopifyUrl}/admin/api/2021-07/orders/${orderId}.json`
  );
}

async function getOrderSingleLineItems(orderId) {
  const orderSingle = await getOrderSingle(orderId);
  return orderSingle?.data?.order?.line_items;
}

async function getCustomersLastOrdersLineItems(customerId) {
  const customerSingle = await getCustomerById(customerId);
  const lastOrderId = customerSingle?.data?.customer?.last_order_id;
  return await getOrderSingleLineItems(lastOrderId);
}

async function getOrderSingleCreatedAt(orderId) {
  const orderSingle = await getOrderSingle(orderId);
  return orderSingle?.data?.order?.created_at.split("T")[0];
}

async function getCustomers() {
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
  return response;
  return await axios.get(`${shopifyUrl}/admin/api/2021-07/customers.json`);
}

async function getCustomerById(customerId) {
  return await axios.get(
    `${shopifyUrl}/admin/api/2021-07/customers/${customerId}.json`
  );
}

async function getCustomerLastOrderId(customerId) {
  const customerSingle = await getCustomerById(customerId);
  return customerSingle?.data?.customer?.last_order_id;
}

async function getCustomerLastOrderDate(customerId) {
  const lastOrderId = await getCustomerLastOrderId(customerId);
  const orderDate = await getOrderSingleCreatedAt(lastOrderId);
  return orderDate;
}

async function getProductById(productId) {
  return await axios.get(
    `${shopifyUrl}/admin/api/2021-07/products/${productId}.json`
  );
}

async function getProductByTitle(title) {
  // console.log(title);
  title = JSON.stringify(title);
  // console.log(title);
  return await axios.get(
    `${shopifyUrl}/admin/api/2021-07/products.json?title=${title}`
  );
}

async function getProducts() {
  const response = {
    products: [
      {
        id: 632910392,
        title: "IPod Nano - 8GB",
        body_html:
          "<p>It's the small iPod with one very big idea: Video. Now the world's most popular music player, available in 4GB and 8GB models, lets you enjoy TV shows, movies, video podcasts, and more. The larger, brighter display means amazing picture quality. In six eye-catching colors, iPod nano is stunning all around. And with models starting at just $149, little speaks volumes.</p>",
        vendor: "Apple",
        product_type: "Cult Products",
        created_at: "2024-01-02T08:59:11-05:00",
        handle: "ipod-nano",
        updated_at: "2024-01-02T08:59:11-05:00",
        published_at: "2007-12-31T19:00:00-05:00",
        template_suffix: null,
        published_scope: "web",
        tags: "Emotive, Flash Memory, MP3, Music",
        status: "active",
        admin_graphql_api_id: "gid://shopify/Product/632910392",
        variants: [
          {
            id: 808950810,
            product_id: 632910392,
            title: "Pink",
            price: "199.00",
            sku: "IPOD2008PINK",
            position: 1,
            inventory_policy: "continue",
            compare_at_price: null,
            fulfillment_service: "manual",
            inventory_management: "shopify",
            option1: "Pink",
            option2: null,
            option3: null,
            created_at: "2024-01-02T08:59:11-05:00",
            updated_at: "2024-01-02T08:59:11-05:00",
            taxable: true,
            barcode: "1234_pink",
            grams: 567,
            image_id: 562641783,
            weight: 1.25,
            weight_unit: "lb",
            inventory_item_id: 808950810,
            inventory_quantity: 10,
            old_inventory_quantity: 10,
            presentment_prices: [
              {
                price: {
                  amount: "199.00",
                  currency_code: "USD",
                },
                compare_at_price: null,
              },
            ],
            requires_shipping: true,
            admin_graphql_api_id: "gid://shopify/ProductVariant/808950810",
          },
          {
            id: 49148385,
            product_id: 632910392,
            title: "Red",
            price: "199.00",
            sku: "IPOD2008RED",
            position: 2,
            inventory_policy: "continue",
            compare_at_price: null,
            fulfillment_service: "manual",
            inventory_management: "shopify",
            option1: "Red",
            option2: null,
            option3: null,
            created_at: "2024-01-02T08:59:11-05:00",
            updated_at: "2024-01-02T08:59:11-05:00",
            taxable: true,
            barcode: "1234_red",
            grams: 567,
            image_id: null,
            weight: 1.25,
            weight_unit: "lb",
            inventory_item_id: 49148385,
            inventory_quantity: 20,
            old_inventory_quantity: 20,
            presentment_prices: [
              {
                price: {
                  amount: "199.00",
                  currency_code: "USD",
                },
                compare_at_price: null,
              },
            ],
            requires_shipping: true,
            admin_graphql_api_id: "gid://shopify/ProductVariant/49148385",
          },
          {
            id: 39072856,
            product_id: 632910392,
            title: "Green",
            price: "199.00",
            sku: "IPOD2008GREEN",
            position: 3,
            inventory_policy: "continue",
            compare_at_price: null,
            fulfillment_service: "manual",
            inventory_management: "shopify",
            option1: "Green",
            option2: null,
            option3: null,
            created_at: "2024-01-02T08:59:11-05:00",
            updated_at: "2024-01-02T08:59:11-05:00",
            taxable: true,
            barcode: "1234_green",
            grams: 567,
            image_id: null,
            weight: 1.25,
            weight_unit: "lb",
            inventory_item_id: 39072856,
            inventory_quantity: 30,
            old_inventory_quantity: 30,
            presentment_prices: [
              {
                price: {
                  amount: "199.00",
                  currency_code: "USD",
                },
                compare_at_price: null,
              },
            ],
            requires_shipping: true,
            admin_graphql_api_id: "gid://shopify/ProductVariant/39072856",
          },
          {
            id: 457924702,
            product_id: 632910392,
            title: "Black",
            price: "199.00",
            sku: "IPOD2008BLACK",
            position: 4,
            inventory_policy: "continue",
            compare_at_price: null,
            fulfillment_service: "manual",
            inventory_management: "shopify",
            option1: "Black",
            option2: null,
            option3: null,
            created_at: "2024-01-02T08:59:11-05:00",
            updated_at: "2024-01-02T08:59:11-05:00",
            taxable: true,
            barcode: "1234_black",
            grams: 567,
            image_id: null,
            weight: 1.25,
            weight_unit: "lb",
            inventory_item_id: 457924702,
            inventory_quantity: 40,
            old_inventory_quantity: 40,
            presentment_prices: [
              {
                price: {
                  amount: "199.00",
                  currency_code: "USD",
                },
                compare_at_price: null,
              },
            ],
            requires_shipping: true,
            admin_graphql_api_id: "gid://shopify/ProductVariant/457924702",
          },
        ],
        options: [
          {
            id: 594680422,
            product_id: 632910392,
            name: "Color",
            position: 1,
            values: ["Pink", "Red", "Green", "Black"],
          },
        ],
        images: [
          {
            id: 850703190,
            alt: null,
            position: 1,
            product_id: 632910392,
            created_at: "2024-01-02T08:59:11-05:00",
            updated_at: "2024-01-02T08:59:11-05:00",
            admin_graphql_api_id: "gid://shopify/ProductImage/850703190",
            width: 123,
            height: 456,
            src: "https://cdn.shopify.com/s/files/1/0005/4838/0009/products/ipod-nano.png?v=1704203951",
            variant_ids: [],
          },
          {
            id: 562641783,
            alt: null,
            position: 2,
            product_id: 632910392,
            created_at: "2024-01-02T08:59:11-05:00",
            updated_at: "2024-01-02T08:59:11-05:00",
            admin_graphql_api_id: "gid://shopify/ProductImage/562641783",
            width: 123,
            height: 456,
            src: "https://cdn.shopify.com/s/files/1/0005/4838/0009/products/ipod-nano-2.png?v=1704203951",
            variant_ids: [808950810],
          },
          {
            id: 378407906,
            alt: null,
            position: 3,
            product_id: 632910392,
            created_at: "2024-01-02T08:59:11-05:00",
            updated_at: "2024-01-02T08:59:11-05:00",
            admin_graphql_api_id: "gid://shopify/ProductImage/378407906",
            width: 123,
            height: 456,
            src: "https://cdn.shopify.com/s/files/1/0005/4838/0009/products/ipod-nano.png?v=1704203951",
            variant_ids: [],
          },
        ],
        image: {
          id: 850703190,
          alt: null,
          position: 1,
          product_id: 632910392,
          created_at: "2024-01-02T08:59:11-05:00",
          updated_at: "2024-01-02T08:59:11-05:00",
          admin_graphql_api_id: "gid://shopify/ProductImage/850703190",
          width: 123,
          height: 456,
          src: "https://cdn.shopify.com/s/files/1/0005/4838/0009/products/ipod-nano.png?v=1704203951",
          variant_ids: [],
        },
      },
      {
        id: 921728736,
        title: "IPod Touch 8GB",
        body_html:
          "<p>The iPod Touch has the iPhone's multi-touch interface, with a physical home button off the touch screen. The home screen has a list of buttons for the available applications.</p>",
        vendor: "Apple",
        product_type: "Cult Products",
        created_at: "2024-01-02T08:59:11-05:00",
        handle: "ipod-touch",
        updated_at: "2024-01-02T08:59:11-05:00",
        published_at: "2008-09-25T20:00:00-04:00",
        template_suffix: null,
        published_scope: "web",
        tags: "",
        status: "active",
        admin_graphql_api_id: "gid://shopify/Product/921728736",
        variants: [
          {
            id: 447654529,
            product_id: 921728736,
            title: "Black",
            price: "199.00",
            sku: "IPOD2009BLACK",
            position: 1,
            inventory_policy: "continue",
            compare_at_price: null,
            fulfillment_service: "shipwire-app",
            inventory_management: "shipwire-app",
            option1: "Black",
            option2: null,
            option3: null,
            created_at: "2024-01-02T08:59:11-05:00",
            updated_at: "2024-01-02T08:59:11-05:00",
            taxable: true,
            barcode: "1234_black",
            grams: 567,
            image_id: null,
            weight: 1.25,
            weight_unit: "lb",
            inventory_item_id: 447654529,
            inventory_quantity: 13,
            old_inventory_quantity: 13,
            presentment_prices: [
              {
                price: {
                  amount: "199.00",
                  currency_code: "USD",
                },
                compare_at_price: null,
              },
            ],
            requires_shipping: true,
            admin_graphql_api_id: "gid://shopify/ProductVariant/447654529",
          },
        ],
        options: [
          {
            id: 891236591,
            product_id: 921728736,
            name: "Title",
            position: 1,
            values: ["Black"],
          },
        ],
        images: [],
        image: null,
      },
    ],
  };
  return response;
  return await axios.get(`${shopifyUrl}/admin/api/2021-07/products.json`);
}

// adds product to order by quantity of 1 and price in USD
async function addItemToOrder(orderId, rewardVariantId, note = "Reward Item") {
  try {
    if (!rewardVariantId) {
      console.log(
        "addItemToOrder Error: parameter->productItem must have a variantId to be added to order"
      );
      return;
    }

    // begin editing order
    const beginEditQuery = `mutation {
      orderEditBegin (id: "gid://shopify/Order/${orderId}"){
        calculatedOrder
        {
          id
        }
        userErrors {
          field
          message
        }
      }
    }`;
    const beginEditResponse = await axios
      .post(graphQlUrl, {
        query: beginEditQuery,
      })
      .then((data) => data.data);
    if (beginEditResponse.data.errors && beginEditResponse.data.errors.length) {
      throw beginEditResponse.data.errors;
    }
    const calculatedOrderId =
      beginEditResponse.data.orderEditBegin.calculatedOrder.id;
    // add item to order mutation
    const addItemQuery = `mutation {
      orderEditAddVariant (id: "${calculatedOrderId}", variantId: "gid://shopify/ProductVariant/${rewardVariantId}", quantity: 1, allowDuplicates: false){
        calculatedLineItem {
          title
        }
        calculatedOrder {
          id
        }
        userErrors {
          field
          message
        }
      }
    }`;
    const addItemResponse = await axios
      .post(graphQlUrl, {
        query: addItemQuery,
      })
      .then((data) => data.data);
    if (addItemResponse.data.errors && addItemResponse.data.errors.length) {
      throw addItemResponse.data.errors;
    }
    // commit response
    const commitEditQuery = `mutation {
      orderEditCommit (id: "${calculatedOrderId}", notifyCustomer: false, staffNote: "${note}") {
        order {
          id
        }
        userErrors {
          field
          message
        }
      }
    }
    `;
    const commitResponse = await axios
      .post(graphQlUrl, {
        query: commitEditQuery,
      })
      .then((data) => data.data);
    if (commitResponse.data.errors && commitResponse.data.errors.length) {
      throw commitResponse.data.errors;
    }

    return "ok";
  } catch (error) {
    console.error(error);
    return "error";
  }
}

module.exports = {
  shopifyUrl,
  graphQlUrl,
  addItemToOrder,
  getUnFulfilledOrders,
  getOrderSingle,
  getOrderSingleCreatedAt,
  getCustomers,
  getCustomerById,
  getCustomerLastOrderId,
  getCustomerLastOrderDate,
  getProducts,
  getProductById,
  getProductByTitle,
  getOrderSingleLineItems,
  getCustomersLastOrdersLineItems,
};
