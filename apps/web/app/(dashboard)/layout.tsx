import { Metadata } from "next";
import { Inter } from "next/font/google";

import { PropsWithChildren } from "react";

import { AuthStoreProvider } from "@/lib/providers/auth-store-provider";
import ModalProvider from "@/lib/providers/modal-provider";

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
        <ModalProvider>
          <AuthGuard mode="auth">
            <AppLayout>{children}</AppLayout>
          </AuthGuard>
        </ModalProvider>
      </AuthStoreProvider>

      {/* decoupled elements for rendering modals and backdrops through portal */}
      <div id="modal"></div>
      <div id="backdrop"></div>
    </body>
  </html>
);

export default DashboardLayout;
