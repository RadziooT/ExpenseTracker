"use client";

import { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const res = await signIn("credentials", {
      username: formData.get("username"),
      password: formData.get("password"),
      redirect: false,
    });
    if (res?.error) {
      // setError(res.error as string);
    }
    if (res?.ok) {
      return router.push("/");
    }
  };

  return (
    <section>
      <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 items-center flex flex-col"
      >
        <input
          type="text"
          placeholder="Username"
          className="w-full border px-3 py-2 rounded"
          required
          name="username"
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border px-3 py-2 rounded"
          required
          name="password"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
        <Link
          href="/auth/register"
          className="text-sm text-[#888] transition duration-150 ease hover:text-black"
        >
          Don't have an account?
        </Link>
      </form>
    </section>
  );
}
