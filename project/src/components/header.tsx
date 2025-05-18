"use client";

import { useEffect, useState } from "react";

import {
  Button,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@heroui/react";
import { useUserContext } from "@/app/userContextProvider";
import Link from "next/link";
import { WalletIcon } from "@heroicons/react/24/outline";
import SendNotification from "@/components/sendNotification";
import { clearCachedData } from "@/services/cacheService";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const { isUserAuthenticated, setIsUserAuthenticated } = useUserContext();

  useEffect(() => {
    setIsUserAuthenticated(isUserAuthenticated);
  }, [isUserAuthenticated]);

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <WalletIcon className="h-6 w-6 text-indigo-600" />
          <p className="font-bold text-inherit">Expense Tracker</p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link color="foreground" href="/home">
            Home
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link
            href="/expenses"
            className={
              !isUserAuthenticated
                ? "text-gray-400 pointer-events-none cursor-not-allowed"
                : ""
            }
            aria-disabled={!isUserAuthenticated}
          >
            Expenses
          </Link>
        </NavbarItem>
        <NavbarItem>
          <SendNotification></SendNotification>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end">
        {!isUserAuthenticated && (
          <>
            <NavbarItem>
              <Button
                as={Link}
                color="secondary"
                href="/auth/login"
                variant="flat"
              >
                Login
              </Button>
            </NavbarItem>
            <NavbarItem>
              <Button
                as={Link}
                color="secondary"
                href="/auth/register"
                variant="flat"
              >
                Sign Up
              </Button>
            </NavbarItem>
          </>
        )}

        {isUserAuthenticated && (
          <NavbarItem className="hidden lg:flex">
            <Button
              color="primary"
              variant="flat"
              onPress={() => {
                clearCachedData().then(() => setIsUserAuthenticated(false));
              }}
            >
              Logout
            </Button>
          </NavbarItem>
        )}
      </NavbarContent>

      <NavbarMenu>
        <NavbarMenuItem>
          <Link color="foreground" href="/home">
            Home
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link
            href="/expenses"
            className={
              !isUserAuthenticated
                ? "text-gray-400 pointer-events-none cursor-not-allowed"
                : ""
            }
            aria-disabled={!isUserAuthenticated}
          >
            Expenses
          </Link>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
}
