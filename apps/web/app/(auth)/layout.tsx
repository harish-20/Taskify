import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { FC, PropsWithChildren } from "react";

import AuthLayout from "@/layouts/AuthLayout";

import { AuthStoreProvider } from "@/lib/providers/auth-store-provider";

import "@/app/globals.css";
import AuthGuard from "@/components/auth/AuthGuard";

const inter = Inter();

export const metadata: Metadata = {
  title: "Taskify",
  description:
    "A simple and powerful task management app to organize your work, track progress, and boost productivity every day.",
};

const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthStoreProvider>
          <AuthGuard mode="unauth">
            <AuthLayout>{children}</AuthLayout>
          </AuthGuard>
        </AuthStoreProvider>
      </body>
    </html>
  );
};

export default Layout;
