"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { useSession } from "next-auth/react";

interface UserContextType {
  userId: string | null;
  isOffline: boolean;
  isUserAuthenticated: string;
  setUserId: (id: string) => void;
  setIsOffline: (status: boolean) => void;
  setIsUserAuthenticated: (status: string) => void;
}

const UserContext = createContext<UserContextType>({
  userId: null,
  isOffline: false,
  isUserAuthenticated: "unauthenticated",
  setIsOffline(status: boolean): void {},
  setIsUserAuthenticated(status: string): void {},
  setUserId(id: string): void {},
});

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [userId, setUserIdState] = useState<string | null>(null);
  const [isOffline, setIsOfflineState] = useState<boolean>(false);
  const [isUserAuthenticated, setIsUserAuthenticated] =
    useState<string>("unauthenticated");

  const setUserId = (id: string) => {
    setUserIdState(id);
  };

  const setIsOffline = (status: boolean) => {
    setIsOfflineState(status);
  };

  return (
    <UserContext.Provider
      value={{
        userId,
        isOffline,
        isUserAuthenticated,
        setUserId,
        setIsOffline,
        setIsUserAuthenticated,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};
