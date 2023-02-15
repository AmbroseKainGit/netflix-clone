import {
  createCheckoutSession,
  getStripePayments
} from "@stripe/firestore-stripe-payments";
import {
  getFunctions,
  httpsCallable,
  HttpsCallableResult
} from "@firebase/functions";
import app from "./firebase";

const payments = getStripePayments(app, {
  productsCollection: "products",
  customersCollection: "customers"
});
const loadCheckout = async (priceId: string) => {
  await createCheckoutSession(payments, {
    price: priceId,
    success_url: window.location.origin,
    cancel_url: window.location.origin
  })
    .then((snapshot) => window.location.assign(snapshot.url))
    .catch((error) => console.error(error.message));
};
interface RequestData {
  returnUrl: string;
}

interface ResponseData {
  url: string;
}

const redirectToBillingPortal = async () => {
  const instance = getFunctions(app, "us-central1");
  // Returns an http url
  const functionRef = httpsCallable<RequestData, ResponseData>(
    instance,
    "ext-firestore-stripe-payments-createPortalLink"
  );
  await functionRef({
    returnUrl: `${window.location.origin}/account`
  })
    .then(({ data }: HttpsCallableResult<ResponseData>) =>
      window.location.assign(data?.url)
    )
    .catch((error) => console.error(error));
};

export default payments;
export { loadCheckout, redirectToBillingPortal };
