"use client";

import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { addToast } from "@heroui/react";
import Link from "next/link";
import Loading from "@/components/global/loading";

export interface RegisterUserRequestDTO {
  username: string;
  password: string;
  firstName: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const register = async (formData: FormData) => {
    setIsLoading(true);

    const requestData: RegisterUserRequestDTO = {
      username: formData.get("username") as string,
      password: formData.get("password") as string,
      firstName: formData.get("firstName") as string,
    };

    try {
      await fetch("/api/auth/registerUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      formRef.current?.reset();
      return router.push("/auth/login");
    } catch (err: any) {
      console.log(err);
      if (err.message == "Failed to fetch") {
        addToast({
          title: "Offline mode",
          description: "Registering is available only in online mode",
          color: "warning",
          timeout: 2000,
          shouldShowTimeoutProgress: true,
        });
      } else {
        addToast({
          title: "Oops!",
          description: "Couldn't create user. Try again later",
          color: "warning",
          timeout: 2000,
          shouldShowTimeoutProgress: true,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <Loading loadingContent="Registering user..." />;

  return (
    <section>
      <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>
      <form
        ref={formRef}
        action={register}
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
