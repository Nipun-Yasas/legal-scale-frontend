"use client";

import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/_components/common/Sidebar";
import { ThemeToggle } from "@/_components/common/ThemeToggle";
import { LogOut, Scale } from "lucide-react";
import { motion } from "motion/react";
import { useAuth } from "@/context/AuthContext";
import { getNavigation } from "@/lib/getNavigation";

export default function RoleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();

  const navLinks = getNavigation(user?.role);

  return (
    <div className="flex flex-col md:flex-row h-screen w-full overflow-hidden bg-background">
      <Sidebar open={open} setOpen={setOpen} animate={true}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {/* Logo */}
            <div className="flex items-center gap-2 py-2 mb-6">
              <div className="flex items-center justify-center shrink-0 ">
                <Scale className="h-6 w-6 text-primary shrink-0" />
              </div>
              <motion.span
                animate={{
                  display: open ? "inline-block" : "none",
                  opacity: open ? 1 : 0,
                }}
                className="font-semibold text-textPrimary text-base whitespace-pre"
              >
                LegalScale
              </motion.span>
            </div>

            {/* Nav links */}
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <SidebarLink key={link.href} link={link} />
              ))}
            </div>
          </div>

          {/* Bottom */}
          <div className="flex flex-col gap-2">
            <ThemeToggle />
            <SidebarLink
              onClick={(e) => {
                e.preventDefault();
                logout();
              }}
              link={{
                label: "Logout",
                href: "#",
                icon: <LogOut className="h-5 w-5 shrink-0 text-red-400" />,
              }}
              className="text-red-400 cursor-pointer"
            />
          </div>
        </SidebarBody>
      </Sidebar>

      <main className="flex-1 overflow-y-auto bg-background p-4 md:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
