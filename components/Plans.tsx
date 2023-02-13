import Head from "next/head";
import Link from "next/link";
import useAuth from "../hooks/useAuth";
import { CheckIcon } from "@heroicons/react/outline";

function Plans() {
  const { logout } = useAuth();

  const LiComponent = (heading: string) => {
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
      <main className="pt-28 max-w-5xl pl-28 pb-12 transition-all md:px-10">
        <h1 className="mb-3 text-3xl font-medium">
          Choose the plan thats right for you
        </h1>
        <ul>
          {LiComponent("Watch all you want. Ad-Free.")}
          {LiComponent("Recomendations Just for you")}
          {LiComponent("Cancel you plan anytime")}
        </ul>

        <div className="mt-4 flex flex-col space-y-0">
          <div className="flex w-full items-center justify-center self-end md:w-3/5">
            <div className="plan-box">Standard</div>
            <div className="plan-box">Standard</div>
            <div className="plan-box">Standard</div>
          </div>
          {/* <Table /> */}

          <button> Subscribe </button>
        </div>
      </main>
    </div>
  );
}

export default Plans;
