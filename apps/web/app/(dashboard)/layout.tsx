import { Metadata } from "next";
import { Inter } from "next/font/google";

import { PropsWithChildren } from "react";

import { AuthStoreProvider } from "@/lib/providers/auth-store-provider";

import AuthGuard from "@/components/auth/AuthGuard";

import AppLayout from "@/layouts/AppLayout";

import "@/app/globals.css";

const inter = Inter();

export const metadata: Metadata = {
  title: "Taskify",
  description:
    "A simple and powerful task management app to organize your work, track progress, and boost productivity every day.",
};

interface DashboardLayoutProps extends PropsWithChildren {}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => (
  <html lang="en" suppressHydrationWarning>
    <body className={inter.className}>
      <AuthStoreProvider>
        <AuthGuard mode="auth">
          <AppLayout>{children}</AppLayout>
        </AuthGuard>
      </AuthStoreProvider>
    </body>
  </html>
);

export default DashboardLayout;
