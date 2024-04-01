const axios = require("axios");
const shopifyUrl = "https://quickstart-c8e6d98e.myshopify.com";
const graphQlUrl = `${shopifyUrl}/admin/api/2021-07/graphql.json`;

async function getUnFulfilledOrders() {
  const orders = await axios.get(
    `${shopifyUrl}/admin/api/2024-01/orders.json?fulfillment_status=unfulfilled&limit=250`
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
    `${shopifyUrl}/admin/api/2024-01/orders/${orderId}.json`
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
  return await axios.get(`${shopifyUrl}/admin/api/2024-01/customers.json`, {
    headers: {
      "X-Shopify-Access-Token": "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",
    },
  });
}

async function getCustomerById(customerId) {
  return await axios.get(
    `${shopifyUrl}/admin/api/2024-01/customers/${customerId}.json`
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
    `${shopifyUrl}/admin/api/2024-01/products/${productId}.json`
  );
}

async function getProductByTitle(title) {
  // console.log(title);
  title = JSON.stringify(title);
  // console.log(title);
  return await axios.get(
    `${shopifyUrl}/admin/api/2024-01/products.json?title=${title}`
  );
}

async function getProducts() {
  return await axios.get(`${shopifyUrl}/admin/api/2024-01/products.json`, {
    headers: {
      "X-Shopify-Access-Token": "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",
    },
  });
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
