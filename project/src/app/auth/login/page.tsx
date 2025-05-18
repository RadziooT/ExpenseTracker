"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUserContext } from "@/app/userContextProvider";
import { Button, Input } from "@heroui/react";
import Loading from "@/components/global/Loading";
import { initAndCacheUserData } from "@/services/cacheService";

export default function LoginPage() {
  const router = useRouter();
  const { userId, isUserAuthenticated, setIsUserAuthenticated, setUserId } =
    useUserContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    setIsLoading(true);

    const loginState = await fetch("/api/auth/loginUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
    const userId = await loginState.json();
    const data = await initAndCacheUserData(userId);
    setUserId(data.userData.userId);
    setIsUserAuthenticated(true);
    return router.push("/home");
  };

  if (isLoading) return <Loading loadingContent="Setting up your data..." />;

  return (
    <section>
      <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
      <Input
        isRequired
        isClearable
        label="Username"
        name="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        onClear={() => setUsername("")}
      />

      <Input
        label="Password"
        placeholder="Enter your password"
        isClearable
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onClear={() => setPassword("")}
      />

      <Button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        onPress={() => login()}
      >
        Login
      </Button>

      <Link
        href="/auth/register"
        className="text-sm text-[#888] transition duration-150 ease hover:text-black"
      >
        Don't have an account?
      </Link>
    </section>
  );
}
