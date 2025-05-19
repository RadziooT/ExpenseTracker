"use client";

import React, { useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { addToast, Button, Input } from "@heroui/react";
import Link from "next/link";
import Loading from "@/components/global/loading";
import { RegisterUserRequestDTO } from "@/types/api/RegisterUserRequestDTO";

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");

  const router = useRouter();

  const register = async () => {
    setIsLoading(true);

    const requestData: RegisterUserRequestDTO = {
      username,
      password,
      firstName,
    };

    try {
      await fetch("/api/auth/registerUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      router.push("/auth/login");
    } catch (err: any) {
      console.log(err);
      setUsername("");
      setPassword("");
      setFirstName("");
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
          description: "Couldn't register user. Try again later",
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
    <div className="w-full max-w-md border border-black p-8 bg-white shadow-md rounded">
      <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>

      <div className="space-y-4 items-center flex flex-col">
        <Input
          className="mb-4"
          isRequired
          isClearable
          label="Username"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onClear={() => setUsername("")}
        />

        <Input
          className="mb-4"
          label="Password"
          placeholder="Enter your password"
          isClearable
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onClear={() => setPassword("")}
        />

        <Input
          className="mb-4"
          label="First name"
          placeholder="Enter first name"
          isClearable
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          onClear={() => setFirstName("")}
        />

        <Button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          onPress={() => register()}
        >
          Register
        </Button>

        <Link
          href="/auth/login"
          className="text-sm text-[#888] transition duration-150 ease hover:text-black"
        >
          Already have an account?
        </Link>
      </div>
    </div>
  );
}
