"use client";

import { User } from "@/lib/types";
import { logout } from "@/lib/user";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useRef, useState } from "react";
import { CustomDropdown, DefaultDropdownElement } from "../Dropdown";
import { FiMessageSquare, FiSearch } from "react-icons/fi";
import { HeaderWrapper } from "./HeaderWrapper";
import { SettingsContext } from "../settings/SettingsProvider";
import { UserDropdown } from "../UserDropdown";

interface HeaderProps {
  user: User | null;
}

export function Header({ user }: HeaderProps) {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    const response = await logout();
    if (!response.ok) {
      alert("Failed to logout");
    }
    // disable auto-redirect immediately after logging out so the user
    // is not immediately re-logged in
    router.push("/auth/login?disableAutoRedirect=true");
  };

  // When dropdownOpen state changes, it attaches/removes the click listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }

    // Clean up function to remove listener when component unmounts
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [dropdownOpen]);

  const combinedSettings = useContext(SettingsContext);
  if (!combinedSettings) {
    return null;
  }
  const settings = combinedSettings.settings;

  return (
    <HeaderWrapper>
      <div className="flex h-full">
        <Link
          className="py-4"
          href={
            settings && settings.default_page === "chat" ? "/chat" : "/search"
          }
        >
          <div className="flex">
            <div className="h-[32px] w-[30px]">
              <Image src="/logo.png" alt="Logo" width="1419" height="1520" />
            </div>
            <h1 className="flex text-2xl text-strong font-bold my-auto">
              LME Chat
            </h1>
          </div>
        </Link>

        {(!settings ||
          (settings.search_page_enabled && settings.chat_page_enabled)) && (
          <>
            <Link
              href="/search"
              className={"ml-6 h-full flex flex-col hover:bg-hover"}
            >
              <div className="w-24 flex my-auto">
                <div className={"mx-auto flex text-strong px-2"}>
                  <FiSearch className="my-auto mr-1" />
                  <h1 className="flex text-sm font-bold my-auto">Search</h1>
                </div>
              </div>
            </Link>

            <Link href="/chat" className="h-full flex flex-col hover:bg-hover">
              <div className="w-24 flex my-auto">
                <div className="mx-auto flex text-strong px-2">
                  <FiMessageSquare className="my-auto mr-1" />
                  <h1 className="flex text-sm font-bold my-auto">Chat</h1>
                </div>
              </div>
            </Link>
          </>
        )}

        <div className="ml-auto h-full flex flex-col">
          <div className="my-auto">
            <UserDropdown user={user} hideChatAndSearch />
          </div>
        </div>
      </div>
    </HeaderWrapper>
  );
}

/* 

*/
