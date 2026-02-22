"use client";

import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/_components/common/Sidebar";
import { ThemeToggle } from "@/_components/common/ThemeToggle";
import {
  LayoutDashboard,
  Users,
  FileSearch,
  GitBranch,
  LogOut,
  Scale,
} from "lucide-react";
import { motion } from "motion/react";

const navLinks = [
  {
    label: "Dashboard",
    href: "/legal_supervisor_dashboard",
    icon: <LayoutDashboard className="h-5 w-5 shrink-0 text-textSecondary" />,
  },
  {
    label: "Legal Officers",
    href: "/legal_supervisor_dashboard/officers",
    icon: <Users className="h-5 w-5 shrink-0 text-textSecondary" />,
  },
  {
    label: "Documents",
    href: "/legal_supervisor_dashboard/documents",
    icon: <FileSearch className="h-5 w-5 shrink-0 text-textSecondary" />,
  },
  {
    label: "Case Shifts",
    href: "/legal_supervisor_dashboard/case-shifts",
    icon: <GitBranch className="h-5 w-5 shrink-0 text-textSecondary" />,
  },
];

export default function LegalSupervisorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col md:flex-row h-screen w-full overflow-hidden bg-background">
      <Sidebar open={open} setOpen={setOpen} animate={true}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {/* Logo */}
            <div className="flex items-center gap-2 py-2 mb-6">
              <div className="flex items-center justify-center shrink-0 w-11 sm:w-10">
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
              link={{
                label: "Logout",
                href: "/auth",
                icon: <LogOut className="h-5 w-5 shrink-0 text-red-400" />,
              }}
              className="text-red-400"
            />
          </div>
        </SidebarBody>
      </Sidebar>

      <main className="flex-1 overflow-y-auto bg-background p-4 md:p-6 lg:p-8">{children}</main>
    </div>
  );
}
