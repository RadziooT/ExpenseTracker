"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { register, RegisterUserRequestDTO } from "@/actions/register";
import { addToast } from "@heroui/react";
import Link from "next/link";

export default function RegisterPage() {
  const [error, setError] = useState<string>();
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (formData: FormData) => {
    const requestData: RegisterUserRequestDTO = {
      username: formData.get("username") as string,
      password: formData.get("password") as string,
      firstName: formData.get("firstName") as string,
    };
    await register(requestData)
      .then(() => {
        formRef.current?.reset();
        return router.push("/auth/login");
      })
      .catch((error) => {
        setError(error);
        addToast({
          title: "Oops!",
          description: "Something went wrong when registering user",
          color: "danger",
          timeout: 2000,
          shouldShowTimeoutProgress: true,
        });
      });
  };

  return (
    <section>
      <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>
      <form
        ref={formRef}
        action={handleSubmit}
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
        <input
          type="text"
          placeholder="First Name"
          className="w-full border px-3 py-2 rounded"
          required
          name="firstName"
        />
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Register
        </button>
        <Link
          href="/auth/login"
          className="text-sm text-[#888] transition duration-150 ease hover:text-black"
        >
          Already have an account?
        </Link>
      </form>
    </section>
  );
}
