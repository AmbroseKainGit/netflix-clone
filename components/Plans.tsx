import Head from "next/head";
import Link from "next/link";
import useAuth from "../hooks/useAuth";
import { CheckIcon } from "@heroicons/react/outline";
import { Product } from "@stripe/firestore-stripe-payments";
import { Table } from "./Table";
import { useState } from "react";
import Loader from './Loader';
import { loadCheckout } from '../lib/stripe';

interface Props {
  products: Product[];
}
function Plans({ products }: Props) {
  const { logout, user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<Product | null>(products[2]);
  const [isBillingLoading, setBillingLoading] = useState(false);
  const subscribeToPlan = () => {
    if (!user) return;
    loadCheckout(selectedPlan?.prices[0].id!);
    setBillingLoading(true);
  }
  const ListComponent = (heading: string) => {
    return (
      <li className="li-plan">
        <CheckIcon className="icons-plan" />
        {heading}
      </li>
    );
  };
  return (
    <div>
      <Head>
        <title>Netflix</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="border-b border-white/10 bg-[#141414]">
        <Link href="/">
          <img
            src="https://rb.gy/ulxxee"
            alt="Netflix"
            width={150}
            height={150}
            className="cursor-pointer object-contain"
          />
        </Link>
        <button
          onClick={logout}
          className="text-lg font-medium hover:underline"
        >
          Sign Out
        </button>
      </header>
      <main className="mx-auto pt-28 max-w-5xl pl-28 pb-12 transition-all md:px-10">
        <h1 className="mb-3 text-3xl font-medium">
          Choose the plan thats right for you
        </h1>
        <ul>
          {ListComponent("Watch all you want. Ad-Free.")}
          {ListComponent("Recomendations Just for you")}
          {ListComponent("Cancel you plan anytime")}
        </ul>

        <div className="mt-4 flex flex-col space-y-0">
          <div className="flex w-full items-center justify-center self-end md:w-3/5">
            {products.length > 0 &&
              products.map((product) => (
                <div
                  key={product.id}
                  className={`plan-box ${
                    selectedPlan?.id === product.id
                      ? "opacity-100"
                      : "opacity-50"
                  } `}
                  onClick={() => setSelectedPlan(product)}
                >
                  {product.name}
                </div>
              ))}
          </div>
          <Table products={products} selectedPlan={selectedPlan} />

          <button
            disabled={!selectedPlan || isBillingLoading}
            className={`mx-auto w-11/12 rounded bg-[#e50914] py-4 text-xl shadow hover:bg-[#f6121d] md:w-[420px] ${
              isBillingLoading && "opacity-60"
            } `}
            onClick={subscribeToPlan}
          >
            {isBillingLoading ? (
              <Loader color="dark:fill-gray-300" />
            ) : (
              "Subscribre"
            )}
          </button>
        </div>
      </main>
    </div>
  );
}

export default Plans;
