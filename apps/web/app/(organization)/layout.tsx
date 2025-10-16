import { Metadata } from "next";
import { Inter } from "next/font/google";

import { PropsWithChildren } from "react";

import OrganizationLayout from "@/layouts/OrganizationLayout";

import AuthGuard from "@/components/auth/AuthGuard";

import "@/app/globals.css";

const inter = Inter();

export const metadata: Metadata = {
  title: "Taskify",
  description:
    "A simple and powerful task management app to organize your work, track progress, and boost productivity every day.",
};

interface LayoutProps extends PropsWithChildren {}

const Layout: React.FC<LayoutProps> = ({ children }) => (
  <html lang="en" suppressHydrationWarning>
    <body className={inter.className}>
      <AuthGuard mode="auth">
        <OrganizationLayout>{children}</OrganizationLayout>
      </AuthGuard>
    </body>
  </html>
);

export default Layout;
