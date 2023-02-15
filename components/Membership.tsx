import { useState } from "react";
import useSubscription from "../hooks/useSubscription";
import useAuth from "../hooks/useAuth";
import Loader from "./Loader";
import { redirectToBillingPortal } from "../lib/stripe";

export const Membership = () => {
  const { user } = useAuth();
  const subscription = useSubscription(user);
  const [isBillingLoading, setBillingLoading] = useState(false);

  const manageSubscription = () => {
    if (subscription) {
      setBillingLoading(true);
      redirectToBillingPortal();
      // goToBillingPortal();
    }
  };
  return (
    <div className="account-plan-container py-0">
      <div className="space-y-2 py-4">
        <h4 className="text-lg text-[gray]">Membership &#38; Billing</h4>
        <button
          disabled={isBillingLoading || !subscription}
          className="h-10 w-3/5 whitespace-nowrap bg-gray-300 py-2 text-sm font-medium text-black shadow-md hover:bg-gray-200 md:w-4/5"
          onClick={manageSubscription}
        >
          {isBillingLoading ? (
            <Loader color="dark:fill-[#e50914]" />
          ) : (
            "Cancel Membership"
          )}
        </button>
      </div>
      <div className="col-span-3">
        <div className="flex flex-col justify-between border-b border-white/10 py-4 md:flex-row">
          <div>
            <p className="font-medium">{user?.email}</p>
            <p className="text-[gray]">Pasword: ******</p>
          </div>
          <div className="md:text-right">
            <p className="membership-link">Change Email</p>
            <p className="membership-link">Change password</p>
          </div>
        </div>

        <div>
          <div>
            <p>
              {subscription?.cancel_at_period_end
                ? "Your membership will end on "
                : "Your next billing date is "}
              {subscription?.current_period_end.substring(0, 16)}
            </p>
          </div>
          <div className="md:text-right">
            <p className="membership-link">Manage payment info</p>
            <p className="membership-link">Add backup payment method</p>
            <p className="membership-link">Billing Details</p>
            <p className="membership-link">Change billing day</p>
          </div>
        </div>
      </div>
    </div>
  );
};
