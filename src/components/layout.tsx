import type { ReactNode } from "react";
import { Avatar } from "./avatar";
import { ButtonLink } from "./buttons/buttonLink";
import { Footer } from "./footer";
import { IconButton } from "../components/buttons/iconButton";
import { Logo, SearchIcon } from "../components/icons";
import {
  Menu, 
  MenuItemButton,
  MenuItemLink,
  MenuItems,
  MenuItemsContent, 
} from "./menu";
import { Search } from "../components/search";
import { useCapitalize } from "../utils/text";
import { signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useState } from "react";


type LayoutProps = {
  children: ReactNode
}

export const Layout = ({ children }: LayoutProps) => {
  const { data: session } = useSession();
  const { theme, themes, setTheme } = useTheme();
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    <div className="max-w-3xl px-6 mx-auto">
      
    </div>
  )
}
