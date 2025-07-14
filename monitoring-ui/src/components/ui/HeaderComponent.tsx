import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import { House } from "lucide-react";
import Image from "next/image";

const HeaderComponent = () => {
  return (
    <header className="w-full px-8 flex items-center">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link href="/dashboard">
                <Image
                  src="/logo.png"
                  alt="iNethi Logo"
                  width={50}
                  height={50}
                />
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <p>Welcome, User</p>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
};

export default HeaderComponent;
