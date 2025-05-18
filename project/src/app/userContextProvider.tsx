"use client";

import React, { createContext, ReactNode, useContext, useState } from "react";

interface UserContextType {
  userId: string | null;
  isUserAuthenticated: boolean;
  setUserId: (id: string) => void;
  setIsUserAuthenticated: (status: boolean) => void;
}

const UserContext = createContext<UserContextType>({
  userId: null,
  isUserAuthenticated: false,
  setIsUserAuthenticated(status: boolean): void {},
  setUserId(id: string): void {},
});

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [userId, setUserIdState] = useState<string | null>(null);
  const [isUserAuthenticated, setIsUserAuthenticated] =
    useState<boolean>(false);

  const setUserId = (id: string) => {
    setUserIdState(id);
  };

  return (
    <UserContext.Provider
      value={{
        userId,
        isUserAuthenticated,
        setUserId,
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
