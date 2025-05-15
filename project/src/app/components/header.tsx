"use client";

import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";

import {
  Button,
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Spinner,
} from "@heroui/react";
import { useUserContext } from "@/app/userContextProvider";

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
          {/*TODO: logo*/}
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
          <Link color="foreground" href="/expenses">
            Expenses
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="/statistics">
            Statistics
          </Link>
        </NavbarItem>
        <NavbarItem>{isOffline ? "offline" : "online"}</NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        {status == "loading" && (
          <Spinner
            classNames={{ label: "text-foreground mt-4" }}
            color="success"
            variant="dots"
          />
        )}

        {status == "unauthenticated" && (
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

        {status == "authenticated" && (
          <NavbarItem className="hidden lg:flex">
            <Button
              as={Link}
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
          <Link color="foreground" href="/expenses">
            Expenses
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link color="foreground" href="/statistics">
            Statistics
          </Link>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
}
