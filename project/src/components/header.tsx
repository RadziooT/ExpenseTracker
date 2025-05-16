"use client";

import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";

import {
  Button,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Spinner,
  Tooltip,
  Chip,
} from "@heroui/react";
import { useUserContext } from "@/app/userContextProvider";
import Link from "next/link";
import { WalletIcon } from "@heroicons/react/24/outline";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const { isOffline, setIsOffline, setIsUserAuthenticated } = useUserContext();

  const { status } = useSession();

  useEffect(() => {
    setIsUserAuthenticated(status);
  }, [status]);

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
              status !== "authenticated"
                ? "text-gray-400 pointer-events-none cursor-not-allowed"
                : ""
            }
            aria-disabled={status !== "authenticated"}
          >
            Expenses
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link
            href="/statistics"
            className={
              status !== "authenticated"
                ? "text-gray-400 pointer-events-none cursor-not-allowed"
                : ""
            }
            aria-disabled={status !== "authenticated"}
          >
            Statistics
          </Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex" justify="center">
        <NavbarItem>
          {isOffline ? (
            <Tooltip
              content="You are viewing offline data. Reconnect to sync"
              placement="bottom"
            >
              <Chip
                className="capitalize"
                color="default"
                size="sm"
                variant="flat"
              >
                offline
              </Chip>
            </Tooltip>
          ) : (
            <Chip
              className="capitalize"
              color="success"
              size="sm"
              variant="flat"
            >
              online
            </Chip>
          )}
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end">
        {status === "loading" && (
          <Spinner
            classNames={{ label: "text-foreground mt-4" }}
            color="success"
            variant="dots"
          />
        )}

        {status === "unauthenticated" && (
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

        {status === "authenticated" && (
          <NavbarItem className="hidden lg:flex">
            <Button
              color="primary"
              variant="flat"
              onPress={() => {
                signOut({ callbackUrl: "/home" }).then(() => {});
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
              status !== "authenticated"
                ? "text-gray-400 pointer-events-none cursor-not-allowed"
                : ""
            }
            aria-disabled={status !== "authenticated"}
          >
            Expenses
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link
            href="/statistics"
            className={
              status !== "authenticated"
                ? "text-gray-400 pointer-events-none cursor-not-allowed"
                : ""
            }
            aria-disabled={status !== "authenticated"}
          >
            Statistics
          </Link>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
}
