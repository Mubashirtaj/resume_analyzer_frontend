"use client";
import React, { useEffect, useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "./ui/sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconMoon,
  IconSearch,
  IconSettings,
  IconSun,
  IconUserBolt,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import dynamic from 'next/dynamic';

import { cn } from "@/lib/utils";
import { useTheme } from "@/context/ThemeContext";
import { useUser } from "@/context/userdataContext";
import { ChevronDown, ChevronRight, FileText } from "lucide-react";
import { SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from "./sidebar";
import Link from "next/link";
import { logoutUser } from "@/app/utils/logout";

type User = {
  id: string;
  name: string;
  email: string;
  profileimg?: string;
  credits: number;
  geminimodel?: string | null;
  geminkey?: string | null; 
};

type CVSummary = {
  id: string;
  previewText: string;
};

const ProfilePopup = dynamic(() => import('@/components/ui/profile'), {
  loading: () => null,
  ssr: false,
});

const ThemeToggle = ({ onToggle }: { onToggle: () => void }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const handleToggle = () => {
    toggleTheme();
    onToggle(); // Close sidebar after toggling theme
  };

  return (
    <div
      onClick={handleToggle}
      className="text-neutral-700 dark:text-neutral-200 text-sm py-2 group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre flex cursor-pointer"
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      <SidebarLink
        link={{
          label: isDark ? "Light Mode" : "Dark Mode",
          href: "#",
          icon: (
            <>
              {isDark ? (
                <IconSun className="h-5 w-5" />
              ) : (
                <IconMoon className="h-5 w-5" />
              )}
            </>
          ),
        }}
      />
    </div>
  );
};

export function SidebarDemo() {
  const { user, loading, improvedTexts } = useUser() as {
    user: User | null;
    loading: boolean;
    improvedTexts: { id: string; previewText: string }[];
  };


  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [open, setOpen] = useState(false);

  // Function to close sidebar
  const closeSidebar = () => {
    setOpen(false);
  };

  // Handler for sidebar link clicks
  const handleLinkClick = () => {
    closeSidebar();
  };

  // Handler for profile click
  const handleProfileClick = () => {
    setShowProfilePopup(true);
    closeSidebar();
  };

  const links = [
    {
      label: "Dashboard",
      href: "#",
      icon: (
        <IconBrandTabler className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Resume Analyzer",
      href: "/analyzer",
      icon: (
        <IconUserBolt className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
  label: "Job Finder",
  href: "/job",
  icon: (
    <IconSearch  className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
  ),
},

    // {
    //   label: "Settings",
    //   href: "#",
    //   icon: (
    //     <IconSettings className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
    //   ),
    // },
    {
      label: "Logout",
      href: "#",
      icon: (
        <IconArrowLeft onClick={logoutUser}  className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
  ];

  return (
    <>
      <div className="">
        <Sidebar open={open} setOpen={setOpen}>
          <SidebarBody className="justify-between gap-10">
            <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
              {open ? <Logo /> : <LogoIcon />}
              <div className="mt-8 flex flex-col gap-2">
                {links.map((link, idx) => (
                  <div key={idx} onClick={handleLinkClick}>
                    <SidebarLink link={link} />
                  </div>
                ))}
                
                <SidebarMenuItem className="-ml-1">
                  <SidebarMenuButton
                    onClick={() => setOpenDropdown(!openDropdown)}
                    className="flex items-left w-full rounded-lg text-neutral-700 dark:text-neutral-200"
                  >
                    <FileText className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
                    <div className="flex-shrink-0 whitespace-nowrap text-neutral-700 dark:text-neutral-200">
                      My CV Summaries
                    </div>

                    {openDropdown ? (
                      <ChevronDown className="ml-auto h-4 w-4" />
                    ) : (
                      <ChevronRight className="ml-auto h-4 w-4" />
                    )}
                  </SidebarMenuButton>

                  {openDropdown && (
                    <SidebarMenuSub className="dropdown-scroll mt-2 max-h-[260px] overflow-y-auto p-2 rounded-xl animate-fade">
                      {improvedTexts.length > 0 ? (
                        improvedTexts.map((cv) => (
                          <SidebarMenuSubItem key={cv.id} className="mb-1">
                            <Link href={`/chat/${cv.id}`} onClick={closeSidebar}>
                              <SidebarMenuSubButton
                                className="w-full 
                                           pt-1 rounded-lg text-left text-sm 
                                           hover:bg-neutral-200 dark:hover:bg-neutral-700 
                                           transition-all whitespace-normal 
                                           overflow-hidden line-clamp-2"
                              >
                                {cv.previewText}
                              </SidebarMenuSubButton>
                            </Link>
                          </SidebarMenuSubItem>
                        ))
                      ) : (
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton
                            
                            className="w-full bg-neutral-100 dark:bg-neutral-900 
                                       px-3 py-2 rounded-lg text-left text-sm 
                                       text-neutral-400"
                          >
                            No summary available
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      )}
                    </SidebarMenuSub>
                  )}
                </SidebarMenuItem>

                <ThemeToggle onToggle={closeSidebar} />
              </div>
            </div>

            <div>
              {/* Credits Display */}
              {open ? (
                <div className="mb-3 px-4 py-3 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-neutral-800 dark:to-neutral-900 border border-blue-200 dark:border-neutral-700 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-blue-700 dark:text-blue-400 uppercase tracking-wide">
                      Credits
                    </span>
                    <span className="text-lg font-bold text-blue-900 dark:text-white bg-white dark:bg-neutral-800 px-3 py-1 rounded-lg shadow-sm">
                      {user?.credits || 0}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="mb-3 flex items-center justify-center">
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-200"></div>
                    <span className="relative flex items-center justify-center text-base font-bold text-white bg-gradient-to-br from-blue-600 to-indigo-600 w-10 h-10 rounded-lg shadow-lg">
                      {user?.credits || 0}
                    </span>
                  </div>
                </div>
              )}

              {/* Profile Link */}
              <div onClick={handleProfileClick}>
                <SidebarLink
                  link={{
                    label: user?.name || "guest",
                    href: "#",
                    icon: (
                      <img
                        src={user?.profileimg || "/defaultimage.png"}
                        className="h-7 w-7 shrink-0 rounded-full"
                        width={50}
                        height={50}
                        alt="Avatar"
                      />
                    ),
                  }}
                />
              </div>
            </div>
          </SidebarBody>
        </Sidebar>
        {showProfilePopup && (
          <ProfilePopup
            onClose={() => {
              setShowProfilePopup(false);
            }}
          />
        )}
      </div>
    </>
  );
}

export const Logo = () => {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium whitespace-pre text-black dark:text-white"
      >
        Acet Labs
      </motion.span>
    </a>
  );
};

export const LogoIcon = () => {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
    </a>
  );
};

const Dashboard = () => {
  return (
    <div className="flex flex-1">
      <div className="flex h-full w-full flex-1 flex-col gap-2 rounded-tl-2xl border border-neutral-200 bg-white p-2 md:p-10 dark:border-neutral-700 dark:bg-neutral-900">
        <div className="flex gap-2">
          {[...new Array(4)].map((i, idx) => (
            <div
              key={"first-array-demo-1" + idx}
              className="h-20 w-full animate-pulse rounded-lg bg-gray-100 dark:bg-neutral-800"
            ></div>
          ))}
        </div>
        <div className="flex flex-1 gap-2">
          {[...new Array(2)].map((i, idx) => (
            <div
              key={"second-array-demo-1" + idx}
              className="h-full w-full animate-pulse rounded-lg bg-gray-100 dark:bg-neutral-800"
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};