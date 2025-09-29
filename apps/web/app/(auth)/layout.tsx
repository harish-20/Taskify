import { Inter } from "next/font/google";

import { FC, PropsWithChildren } from "react";

import AuthLayout from "@/layouts/AuthLayout";

import "@/app/globals.css";

const inter = Inter();

const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthLayout>{children}</AuthLayout>
      </body>
    </html>
  );
};

export default Layout;
