"use client";

import React, { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useUserContext } from "@/app/userContextProvider";
import { initAndCacheUserData } from "@/services/initService";
import { Button, Input } from "@heroui/react";
import { saveUserData } from "@/services/frontendDb/userService";

export default function LoginPage() {
  const router = useRouter();
  const { userId, isOffline, setUserId, setIsOffline } = useUserContext();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    const res = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });
    if (res?.error) {
      // setError(res.error as string);
    }
    if (res?.ok) {
      const data = await initAndCacheUserData(username);
      setUserId(data.userData.userId);
      setIsOffline(false);
      return router.push("/home");
    }
  };

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
