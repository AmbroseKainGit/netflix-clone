import Head from 'next/head';
import Image from 'next/image';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import useAuth from '../hooks/useAuth';

interface Inputs {
  email: string,
  password: string,
};

function Login() {
  const [login, setLogin] = useState(false);
  const { signIn, signUp } = useAuth();
  const { register, handleSubmit, watch, formState: { errors } } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async ({ email, password }) => {
    console.log(email, password);
    if (login) {
      await signIn(email, password);
      return;
    }
    await signUp(email, password);
  };
  return (
    <div className="relative flex h-screen w-screen flex-col bg-black md:items-center md:justify-center md:bg-transparent ">
      <Head>
        <title>Netflix</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Image
        src="https://rb.gy/p2hphi"
        layout="fill"
        className="-z-10 !hidden opacity-60 sm:!inline"
        objectFit="cover"
      />

      <div className="absolute left-2 top-2 h-20 w-44 cursor-pointer md:left-8 md:top-4">
        <Image src="https://rb.gy/ek4j9f" layout="fill" objectFit="contain" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="relative mt-24 space-y-8 rounded bg-black/75 py-10 px-6 md:mt-0 md:max-w-md md:px-14">
        <h1 className="text-4xl font-semibold">Sign In</h1>
        <div className="space-y-4">
          <label className="inline-block w-full">
            <input autoComplete="username" type="email" placeholder="Email" className="input" {...register("email", { required: true })} />
            {errors.email &&
              <p className="p-1 text-[13px] font-light text-orange-500">
                Please enter a valid Email
              </p>
            }
          </label>
          <label className="inline-block w-full">
            <input autoComplete='new-password' type="password" placeholder="Password" className="input" {...register("password", { required: true, minLength: 6 })} />
            {errors.password &&
              <p className="p-1 text-[13px] font-light text-orange-500">
                Your password must contain between 4 and 60 characters
              </p>
            }
          </label>
        </div>

        <button className="w-full rounded bg-[#e50914] py-3 font-semibold" onClick={() => setLogin(true)}
        >Sign In
        </button>
        <div className="text-[gray]">
          New to Netflix?{' '}
          <button type="submit" className="text-white hover:underline" onClick={() => setLogin(false)}>
            Sign up now
          </button>
        </div>
      </form>
    </div>
  )
}

export default Login