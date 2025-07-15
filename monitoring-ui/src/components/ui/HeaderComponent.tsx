"use client";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/authContext";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const HeaderComponent = () => {
  const { isAuthenticated, logout } = useAuth();
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      // Try to get username from localStorage (set on login/register)
      setUsername(localStorage.getItem("auth_username"));
    } else {
      setUsername(null);
    }
  }, [isAuthenticated]);

  return (
    <header className="w-full px-8 flex items-center">
      <NavigationMenu className="flex-1">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link href="/dashboard">
                <Image
                  src="/logo.png"
                  alt="iNethi Logo"
                  width={50}
                  height={50}
                  priority
                />
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            {isAuthenticated && username ? (
              <p>Welcome, {username}</p>
            ) : (
              <p>Welcome to the iNethi Monitoring System</p>
            )}
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      {isAuthenticated && (
        <div className="ml-auto">
          <Button onClick={logout}>Logout</Button>
        </div>
      )}
    </header>
  );
};

export default HeaderComponent;
