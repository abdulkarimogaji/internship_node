const stripe = Stripe(
  "pk_test_51Ll5ukBgOlWo0lDUrBhA2W7EX2MwUH9AR5Y3KQoujf7PTQagZAJylWP1UOFbtH4UwxoufZbInwehQppWAq53kmNC00UIKSmebO"
);

document.addEventListener("DOMContentLoaded", function () {
  var exampleModal = new bootstrap.Modal(
    document.getElementById("exampleModal")
  );
  exampleModal.show();
});

const form = document.getElementById("payment-form");

const options = {
  clientSecret: form.dataset.secret,
  appearance: {},
};

const elements = stripe.elements(options);

const paymentElement = elements.create("payment");
paymentElement.mount("#payment-element");

form.addEventListener("submit", async (event) => {
  console.log("submitting");
  event.preventDefault();

  const { error } = await stripe.confirmPayment({
    elements,
    confirmParams: {
      return_url: `http://localhost:3000/products/${form.dataset.productId}/payment-complete`,
    },
  });

  if (error) {
    const messageContainer = document.querySelector("#error-message");
    messageContainer.textContent = error.message;
  } else {
  }
});
