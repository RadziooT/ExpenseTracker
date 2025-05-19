"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUserContext } from "@/app/userContextProvider";
import { addToast, Button, Input } from "@heroui/react";
import Loading from "@/components/global/loading";
import { initAndCacheUserData } from "@/services/cacheService";

export default function LoginPage() {
  const { setIsUserAuthenticated, setUserId } = useUserContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const login = async () => {
    setIsLoading(true);

    try {
      const loginResult = await fetch("/api/auth/loginUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const userId = await loginResult.json();
      const data = await initAndCacheUserData(userId);
      setUserId(data.userData.userId);
      setIsUserAuthenticated(true);
      return router.push("/statistics");
    } catch (err: any) {
      setUsername("");
      setPassword("");
      if (err.message == "Failed to fetch") {
        addToast({
          title: "Offline mode",
          description: "Login is available only in online mode",
          color: "warning",
          timeout: 2000,
          shouldShowTimeoutProgress: true,
        });
      } else {
        addToast({
          title: "Oops!",
          description: "Couldn't login. Try again later",
          color: "warning",
          timeout: 2000,
          shouldShowTimeoutProgress: true,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <Loading loadingContent="Setting up your data..." />;

  return (
    <div className="w-full max-w-md border border-black p-8 bg-white shadow-md rounded">
      <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

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
          Don&apos;t have an account?
        </Link>
      </div>
    </div>
  );
}
