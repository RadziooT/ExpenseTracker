"use client";

import React, { createContext, ReactNode, useContext, useState } from "react";

interface UserContextType {
  userId: string | null;
  isUserAuthenticated: boolean;
  dataRefreshRequired: boolean;
  setUserId: (id: string) => void;
  setIsUserAuthenticated: (status: boolean) => void;
  setDataRefreshRequired: (status: boolean) => void;
}

const UserContext = createContext<UserContextType>({
  userId: null,
  isUserAuthenticated: false,
  dataRefreshRequired: false,
  setIsUserAuthenticated(status: boolean): void {},
  setUserId(id: string): void {},
  setDataRefreshRequired(refreshRequired: boolean): void {},
});

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [userId, setUserIdState] = useState<string | null>(null);
  const [isUserAuthenticated, setIsUserAuthenticated] =
    useState<boolean>(false);
  const [dataRefreshRequired, setDataRefreshRequired] =
    useState<boolean>(false);

  const setUserId = (id: string) => {
    setUserIdState(id);
  };

  return (
    <UserContext.Provider
      value={{
        userId,
        isUserAuthenticated,
        dataRefreshRequired,
        setUserId,
        setIsUserAuthenticated,
        setDataRefreshRequired,
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
