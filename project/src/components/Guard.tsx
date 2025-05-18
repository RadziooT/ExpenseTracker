"use client";

import { ReactNode, useEffect, useState } from "react";
import { getCachedUserData } from "@/services/cacheService";
import { useUserContext } from "@/app/userContextProvider";
import { useRouter } from "next/navigation";
import Loading from "@/components/global/Loading";

export default function Guard({ children }: { children: ReactNode }) {
  const { userId, setUserId, isUserAuthenticated, setIsUserAuthenticated } =
    useUserContext();
  const [isReady, setIsReady] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (userId) {
      setIsUserAuthenticated(true);
      setIsReady(true);
      return;
    }

    getCachedUserData().then((userData) => {
      if (userData && userData.userId) {
        setUserId(userData.userId);
        setIsUserAuthenticated(true);
        setIsReady(true);
      } else {
        setIsUserAuthenticated(false);
        setIsReady(true);
        router.push("/");
      }
    });
  }, []);

  if (!isReady) return <Loading loadingContent="" />;

  return <>{children}</>;
}
